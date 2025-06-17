import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../common/prisma.service'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { PokemonTCG } from 'pokemon-tcg-sdk-typescript'

@Injectable()
export class PokemonImportService {
  private readonly logger = new Logger(PokemonImportService.name)

  constructor(
    private prisma: PrismaService,
    private elasticsearch: ElasticsearchService,
  ) {}

  async importAllCards(page = 1, pageSize = 250) {
    try {
      const cards = await PokemonTCG.findCardsByQueries({ 
        pageSize, 
        page,
      })

      if (!cards || cards.length === 0) {
        this.logger.log('No more cards to import')
        return { imported: 0, total: 0 }
      }

      let imported = 0
      
      for (const card of cards) {
        try {
          const cardData = {
            tcgId: card.id,
            name: card.name,
            supertype: card.supertype,
            subtypes: card.subtypes || [],
            types: card.types || [],
            hp: card.hp ? parseInt(card.hp) : null,
            retreatCost: card.retreatCost || [],
            number: card.number,
            artist: card.artist || null,
            rarity: card.rarity || null,
            flavorText: card.flavorText || null,
            setId: card.set.id,
            setName: card.set.name,
            setLogo: card.set.images?.logo || null,
            setSeries: card.set.series,
            setPrintedTotal: card.set.printedTotal,
            setTotal: card.set.total,
            setReleaseDate: new Date(card.set.releaseDate),
            imageSmall: card.images.small,
            imageLarge: card.images.large,
            nationalPokedexNumbers: card.nationalPokedexNumbers || [],
            rules: card.rules || [],
            ancientTrait: card.ancientTrait || null,
            abilities: card.abilities || [],
            attacks: card.attacks || [],
            weaknesses: card.weaknesses || [],
            resistances: card.resistances || [],
            standardLegal: card.legalities?.standard === 'Legal',
            expandedLegal: card.legalities?.expanded === 'Legal',
            unlimitedLegal: card.legalities?.unlimited === 'Legal',
            tcgplayerUrl: card.tcgplayer?.url || null,
            cardmarketUrl: card.cardmarket?.url || null,
          }

          await this.prisma.card.upsert({
            where: { tcgId: card.id },
            update: cardData,
            create: cardData,
          })

          // Index in Elasticsearch
          await this.elasticsearch.index({
            index: 'pokemon-cards',
            id: card.id,
            body: {
              id: card.id,
              name: card.name,
              supertype: card.supertype,
              subtypes: card.subtypes,
              types: card.types,
              hp: card.hp,
              rarity: card.rarity,
              setName: card.set.name,
              setSeries: card.set.series,
              artist: card.artist,
              text: [card.name, card.flavorText, ...(card.rules || [])].filter(Boolean).join(' '),
            },
          })

          imported++
        } catch (error) {
          this.logger.error(`Failed to import card ${card.id}:`, error)
        }
      }

      this.logger.log(`Imported ${imported} cards from page ${page}`)
      
      // Import next page
      if (cards.length === pageSize) {
        await this.importAllCards(page + 1, pageSize)
      }

      return { imported, total: cards.length }
    } catch (error) {
      this.logger.error('Import failed:', error)
      throw error
    }
  }

  async createElasticsearchIndex() {
    const indexExists = await this.elasticsearch.indices.exists({ index: 'pokemon-cards' })
    
    if (!indexExists) {
      await this.elasticsearch.indices.create({
        index: 'pokemon-cards',
        body: {
          mappings: {
            properties: {
              id: { type: 'keyword' },
              name: { type: 'text', analyzer: 'standard' },
              supertype: { type: 'keyword' },
              subtypes: { type: 'keyword' },
              types: { type: 'keyword' },
              hp: { type: 'integer' },
              rarity: { type: 'keyword' },
              setName: { type: 'text' },
              setSeries: { type: 'keyword' },
              artist: { type: 'text' },
              text: { type: 'text', analyzer: 'standard' },
            },
          },
        },
      })
    }
  }
}