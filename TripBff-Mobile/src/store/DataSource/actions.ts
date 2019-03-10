import { StoreData } from "../Interfaces"

export const DataSource_GetAllFeeling = "DataSource_GetAllFeeling"

export function getAllFeelings(feelings: Array<StoreData.PreDefinedFeelingVM>) {
    return {
        type: DataSource_GetAllFeeling, feelings
    }
}

 