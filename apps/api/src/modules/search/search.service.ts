import { Injectable } from '@nestjs/common'
import { ElasticsearchService } from '@nestjs/elasticsearch'
import { SearchInput } from './dto/search.input'

@Injectable()
export class SearchService {
  constructor(private elasticsearch: ElasticsearchService) {}

  async searchCards(input: SearchInput) {
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

    const response = await this.elasticsearch.search({
      index: 'pokemon-cards',
      body: {
        from: (input.page - 1) * input.limit,
        size: input.limit,
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
    const response = await this.elasticsearch.search({
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
}