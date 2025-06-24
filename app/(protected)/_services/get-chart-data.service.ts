import api from "@/config/axiosInstance"

const getChartDataService = async()=>{
    const response = await api.get('mood/chart')
    return response.data.chartData
}
export default getChartDataService