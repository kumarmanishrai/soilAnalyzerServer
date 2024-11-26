
const {DailyData, MinuteData} = require('../db/fieldMongo')

exports.dailyData = async (req, res, next) => {
    console.log(" I am fetching data")
    try {
        const Dailydata = await DailyData.find({}); 
        res.status(200).json({ Dailydata});
        
    } catch (error) {
        console.log("error: " + error.message)
    }
    
}

exports.minuteData = async (req, res, next) => {
    console.log(" I am fetching data")
    try {
        const Minutedata = await MinuteData.find({}); 
        res.status(200).json({ Minutedata});
        
    } catch (error) {
        console.log("error: " + error.message)
    }
    
}