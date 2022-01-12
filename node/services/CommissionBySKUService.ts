import type {
  CommissionClient,
  CommissionServiceInputData,
  CommissionServiceOutputData,
  CommissionServiceErrors,
} from '../typings/commission'

export const commissionServiceFieldsForMDGet = ['id', 'commission', 'refId']

export class CommissionBySKUService {
  private commissionClient: CommissionClient
  private commissionData: CommissionServiceInputData

  constructor(
    commissionClient: CommissionClient,
    commissionData: CommissionServiceInputData
  ) {
    this.commissionClient = commissionClient
    this.commissionData = commissionData
  }

  public async get() {
    const data: CommissionServiceOutputData = []
    const errors: CommissionServiceErrors = []

    await Promise.all(
      this.commissionData.map(({ id }) =>
        this.commissionClient
          .get(id, commissionServiceFieldsForMDGet)
          .then((document) => data.push(document))
          .catch((error) => errors.push({ id, message: error.message }))
      )
    )

    return {
      data,
      errors,
    }
  }

  public async saveOrUpdate() {
    const errors: CommissionServiceErrors = []

    const MD_NO_CHANGES_ERROR_STATUS = 304

    await Promise.all(
      this.commissionData.map((commissionInfo) =>
        this.commissionClient
          .saveOrUpdate(commissionInfo)
          .catch(
            (error) =>
              error?.response?.status !== MD_NO_CHANGES_ERROR_STATUS &&
              errors.push({ id: commissionInfo.id, message: error.message })
          )
      )
    )

    return { errors }
  }

  public async delete() {
    const errors: CommissionServiceErrors = []

    await Promise.all(
      this.commissionData.map(({ id }) =>
        this.commissionClient
          .delete(id)
          .catch((error) => errors.push({ id, message: error.message }))
      )
    )

    return { errors }
  }
}
