import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchInput } from './dto/search.input'
import { PrismaService } from '../../common/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class SearchService {
  constructor(
    private elasticsearch: ElasticsearchService,
    private prisma: PrismaService
  ) {}

  async searchCards(input: SearchInput) {
    console.log('SearchService.searchCards called with input:', JSON.stringify(input));
    console.log('Input query field specifically:', input?.query);
    console.log('Input query type:', typeof input?.query);
    console.log('Input query length:', input?.query?.length);
    
    // If input is coming as an empty object, create default values
    if (!input || Object.keys(input).length === 0) {
      input = {
        query: '',
        page: 1,
        limit: 20
      };
    }
    
    try {
      const searchQuery = input.query ? input.query.trim() : '';
      const page = input.page || 1;
      const limit = input.limit || 20;
      const skip = (page - 1) * limit;
      
      // Build where clause for search
      let whereClause: any = {};
      
      if (searchQuery) {
        whereClause.name = { contains: searchQuery, mode: 'insensitive' as const };
      }
      
      // Add anime era filtering
      if (input.animeEras && input.animeEras.length > 0) {
        // Map anime eras back to TCG series
        const animeEraToSeries: { [key: string]: string[] } = {
          'Horizons Era (2023-present)': ['Scarlet & Violet'],
          'Journeys Era (2019-2023)': ['Sword & Shield'],
          'Sun & Moon Era (2016-2019)': ['Sun & Moon'],
          'XY Era (2013-2016)': ['XY'],
          'Black & White Era (2010-2013)': ['Black & White'],
          'Diamond & Pearl Era (2007-2011)': ['HeartGold & SoulSilver', 'Platinum', 'Diamond & Pearl'],
          'Advanced Generation Era (2002-2007)': ['EX', 'E-Card'],
          'Johto Era (1999-2002)': ['Neo'],
          'Indigo League Era (1998-2000)': ['Gym', 'Base']
        };
        
        const seriesForEras = input.animeEras.flatMap(era => animeEraToSeries[era] || []);
        if (seriesForEras.length > 0) {
          whereClause.setSeries = { in: seriesForEras };
        }
      }
      
      // Pokemon Anime Era Mapping (based on TCG series that align with anime/games)
      const getAnimeEra = (setSeries: string): string => {
        const seriesMap: { [key: string]: string } = {
          'Scarlet & Violet': 'Horizons Era (2023-present)',
          'Sword & Shield': 'Journeys Era (2019-2023)', 
          'Sun & Moon': 'Sun & Moon Era (2016-2019)',
          'XY': 'XY Era (2013-2016)',
          'Black & White': 'Black & White Era (2010-2013)',
          'HeartGold & SoulSilver': 'Diamond & Pearl Era (2007-2011)',
          'Platinum': 'Diamond & Pearl Era (2007-2011)',
          'Diamond & Pearl': 'Diamond & Pearl Era (2007-2011)',
          'EX': 'Advanced Generation Era (2002-2007)',
          'E-Card': 'Advanced Generation Era (2002-2007)',
          'Neo': 'Johto Era (1999-2002)',
          'Gym': 'Indigo League Era (1998-2000)',
          'Base': 'Indigo League Era (1998-2000)'
        };
        return seriesMap[setSeries] || 'Other Era';
      };

      // Build orderBy clause based on sortBy parameter
      let orderBy: any = { name: 'asc' }; // default
      
      if (input.sortBy) {
        switch (input.sortBy) {
          case 'price-high':
          case 'price-low':
            // For price sorting, we need to join with PriceHistory and sort by latest marketPrice
            // We'll handle this with a raw query since Prisma doesn't handle this complex case well
            break;
          case 'hp':
            orderBy = { hp: input.sortOrder === 'asc' ? 'asc' : 'desc' };
            break;
          case 'name':
            orderBy = { name: input.sortOrder === 'desc' ? 'desc' : 'asc' };
            break;
          case 'series':
            orderBy = { setSeries: input.sortOrder === 'desc' ? 'desc' : 'asc' };
            break;
          case 'set':
            orderBy = { setName: input.sortOrder === 'desc' ? 'desc' : 'asc' };
            break;
          case 'rarity':
            orderBy = { rarity: input.sortOrder === 'desc' ? 'desc' : 'asc' };
            break;
          case 'release-date':
            orderBy = { setReleaseDate: input.sortOrder === 'asc' ? 'asc' : 'desc' };
            break;
          case 'number':
            orderBy = { number: input.sortOrder === 'desc' ? 'desc' : 'asc' };
            break;
          default:
            orderBy = { name: 'asc' };
        }
      }
      
      // For price sorting, we need a more complex query
      if (input.sortBy === 'price-high' || input.sortBy === 'price-low') {
        const direction = input.sortBy === 'price-high' ? 'DESC' : 'ASC';
        
        // Use raw SQL for complex price sorting with subquery
        const searchPattern = searchQuery ? `%${searchQuery}%` : null;
        const cardsWithPricing = await this.prisma.$queryRaw`
          SELECT DISTINCT c."tcgId", c.name, c.supertype, c.types, c.hp, c.rarity, 
                 c."setName", c."setSeries", c.artist, c."imageSmall", c."imageLarge", 
                 c.number, c."setReleaseDate", c."tcgplayerUrl", c.id,
                 COALESCE(ph."marketPrice", 0) as "marketPrice"
          FROM "Card" c
          LEFT JOIN (
            SELECT DISTINCT ON ("cardId") "cardId", "marketPrice"
            FROM "PriceHistory"
            ORDER BY "cardId", "recordedAt" DESC
          ) ph ON c.id = ph."cardId"
          ${searchPattern ? Prisma.sql`WHERE c.name ILIKE ${searchPattern}` : Prisma.empty}
          ORDER BY COALESCE(ph."marketPrice", 0) ${direction === 'DESC' ? Prisma.sql`DESC` : Prisma.sql`ASC`}, c.name ASC
          LIMIT ${limit} OFFSET ${skip}
        `;
        
        return {
          total: await this.prisma.card.count({ where: whereClause }),
          cards: cardsWithPricing.map((card: any) => ({
            id: card.tcgId,
            name: card.name,
            supertype: card.supertype,
            types: card.types || [],
            hp: card.hp ? card.hp.toString() : null,
            rarity: card.rarity,
            setName: card.setName,
            setSeries: card.setSeries,
            artist: card.artist,
            imageSmall: card.imageSmall,
            imageLarge: card.imageLarge,
            number: card.number,
            setReleaseDate: card.setReleaseDate?.toISOString ? card.setReleaseDate.toISOString() : card.setReleaseDate,
            animeEra: getAnimeEra(card.setSeries),
            marketPrice: card.marketPrice ? parseFloat(card.marketPrice) : null,
            tcgplayerUrl: card.tcgplayerUrl
          })),
          facets: {
            types: [],
            supertypes: [],
            rarities: [],
            setSeries: []
          }
        };
      }
      
      // Regular sorting (non-price)
      const cards = await this.prisma.card.findMany({
        where: whereClause,
        select: {
          tcgId: true,
          name: true,
          supertype: true,
          types: true,
          hp: true,
          rarity: true,
          setName: true,
          setSeries: true,
          artist: true,
          imageSmall: true,
          imageLarge: true,
          number: true,
          setReleaseDate: true,
          tcgplayerUrl: true,
          id: true // Need internal ID for price lookup
        },
        orderBy: orderBy,
        skip: skip,
        take: limit
      });
      
      // Get total count
      const total = await this.prisma.card.count({
        where: whereClause
      });
      
      // Get latest prices efficiently with subquery
      const cardIds = cards.map(card => card.id);
      const priceMap = new Map();
      if (cardIds.length > 0) {
        const latestPrices = await this.prisma.$queryRaw`
          SELECT DISTINCT ON ("cardId") "cardId", "marketPrice"
          FROM "PriceHistory"
          WHERE "cardId" = ANY(${cardIds})
          ORDER BY "cardId", "recordedAt" DESC
        `;
        for (const price of latestPrices as any[]) {
          priceMap.set(price.cardId, price.marketPrice);
        }
      }
      
      // Format results with pricing
      const formattedCards = cards.map(card => ({
        id: card.tcgId,
        name: card.name,
        supertype: card.supertype,
        types: card.types || [],
        hp: card.hp ? card.hp.toString() : null,
        rarity: card.rarity,
        setName: card.setName,
        setSeries: card.setSeries,
        artist: card.artist,
        imageSmall: card.imageSmall,
        imageLarge: card.imageLarge,
        number: card.number,
        setReleaseDate: card.setReleaseDate?.toISOString(),
        animeEra: getAnimeEra(card.setSeries),
        marketPrice: priceMap.get(card.id) || null,
        tcgplayerUrl: card.tcgplayerUrl
      }));
      
      
      return {
        total,
        cards: formattedCards,
        facets: {
          types: [],
          supertypes: [],
          rarities: [],
          setSeries: []
        }
      }
    } catch (error) {
      console.error('Search error:', error)
      
      // Return empty result on error
      return {
        total: 0,
        cards: [],
        facets: {
          types: [],
          supertypes: [],
          rarities: [],
          setSeries: []
        }
      }
    }
  }

  async searchCardsOriginal(input: SearchInput) {
    const must = []
    const filter = []

    if (input.query) {
      must.push({
        multi_match: {
          query: input.query,
          fields: ['name^3', 'text', 'artist'],
          fuzziness: 'AUTO',
        },
      })
    }

    if (input.types?.length) {
      filter.push({ terms: { types: input.types } })
    }

    if (input.supertypes?.length) {
      filter.push({ terms: { supertype: input.supertypes } })
    }

    if (input.rarities?.length) {
      filter.push({ terms: { rarity: input.rarities } })
    }

    if (input.setSeries?.length) {
      filter.push({ terms: { setSeries: input.setSeries } })
    }

    if (input.minHp || input.maxHp) {
      const range: any = {}
      if (input.minHp) range.gte = input.minHp
      if (input.maxHp) range.lte = input.maxHp
      filter.push({ range: { hp: range } })
    }

    const response: any = await (this.elasticsearch as any).search({
      index: 'pokemon-cards',
      from: (input.page - 1) * input.limit,
      size: input.limit,
      body: {
        query: {
          bool: {
            must: must.length ? must : [{ match_all: {} }],
            filter,
          },
        },
        aggs: {
          types: { terms: { field: 'types', size: 20 } },
          supertypes: { terms: { field: 'supertype', size: 10 } },
          rarities: { terms: { field: 'rarity', size: 20 } },
          setSeries: { terms: { field: 'setSeries', size: 50 } },
        },
        sort: input.sortBy ? [{ [input.sortBy]: input.sortOrder || 'asc' }] : undefined,
      },
    })

    return {
      cards: response.hits.hits.map((hit: any) => hit._source),
      total: response.hits.total.value,
      facets: {
        types: response.aggregations.types.buckets,
        supertypes: response.aggregations.supertypes.buckets,
        rarities: response.aggregations.rarities.buckets,
        setSeries: response.aggregations.setSeries.buckets,
      },
    }
  }

  async getSuggestions(query: string) {
    const response: any = await (this.elasticsearch as any).search({
      index: 'pokemon-cards',
      body: {
        size: 10,
        query: {
          match: {
            name: {
              query,
              fuzziness: 'AUTO',
            },
          },
        },
        _source: ['name', 'id'],
      },
    })

    return response.hits.hits.map((hit: any) => ({
      id: hit._source.id,
      name: hit._source.name,
    }))
  }

  async getCardById(id: string) {
    try {
      
      const card = await this.prisma.card.findUnique({
        where: { tcgId: id }
      })
      
      if (!card) {
        return null
      }
      
      // Get the latest price from PriceHistory table
      const latestPrice = await this.prisma.priceHistory.findFirst({
        where: { cardId: card.id },
        orderBy: { recordedAt: 'desc' }
      })
      
      return {
        id: card.tcgId,
        tcgId: card.tcgId,
        name: card.name,
        supertype: card.supertype,
        subtypes: card.subtypes || [],
        types: card.types || [],
        hp: card.hp,
        retreatCost: card.retreatCost || [],
        setId: card.setId,
        setName: card.setName,
        number: card.number,
        artist: card.artist,
        rarity: card.rarity,
        flavorText: card.flavorText,
        imageUrl: card.imageSmall,
        imageUrlHiRes: card.imageLarge,
        tcgplayerUrl: card.tcgplayerUrl,
        cardmarketUrl: card.cardmarketUrl,
        abilities: card.abilities,
        attacks: card.attacks,
        weaknesses: card.weaknesses,
        resistances: card.resistances,
        standardLegal: card.standardLegal,
        expandedLegal: card.expandedLegal,
        marketPrice: latestPrice?.marketPrice || null,
        createdAt: card.createdAt,
        updatedAt: card.updatedAt
      }
    } catch (error) {
      console.error('Error fetching card by ID:', error)
      return null
    }
  }
}