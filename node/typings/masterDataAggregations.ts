export interface AggregateValueInput {
  dataEntity: string
  field: string
  schema: string
  where: string
}

export interface AggregateResponse {
  all_docs: number
  all_docs_aggregated: number
  result: number
}
