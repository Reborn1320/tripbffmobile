import { StoreData } from "../Interfaces"

export const DataSource_GetAllFeeling = "DataSource_GetAllFeeling"
export const DataSource_GetAllActivity = "DataSource_GetAllActivity"

export function getAllFeelings(feelings: Array<StoreData.PreDefinedFeelingVM>) {
    return {
        type: DataSource_GetAllFeeling, feelings
    }
}

export function getAllActivities(activities: Array<StoreData.PreDefinedActivityVM>) {
    return {
        type: DataSource_GetAllActivity, activities
    }
}

 