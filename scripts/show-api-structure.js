const { User } = require('../helpers/mariadb');

async function showApiStructure() {
    try {
        console.log('Showing API response structure...');
        
        // Get one user to show the exact structure
        const user = await User.findOne({
            where: { accessType: 'resident' },
            attributes: [
                "username", 
                "fullname", 
                "uploadedData", 
                "currentPhase", 
                "programStartDate", 
                "rotationSchedule", 
                "ccFeedbackList", 
                "oralExamScore", 
                "isGraduated", 
                "promotedDate", 
                "completionStatus"
            ]
        });
        
        if (user) {
            console.log('\nAPI Response Structure:');
            console.log('====================');
            console.log('Fields included in response:');
            Object.keys(user.dataValues).forEach(key => {
                const value = user.dataValues[key];
                const type = typeof value;
                const isArray = Array.isArray(value);
                const isObject = type === 'object' && value !== null && !isArray;
                console.log(`- ${key}: ${type}${isArray ? ' (array)' : ''}${isObject ? ' (object)' : ''}`);
            });
            
            console.log('\nSample values:');
            console.log('- username:', user.username);
            console.log('- ccFeedbackList length:', Array.isArray(user.ccFeedbackList) ? user.ccFeedbackList.length : 'not an array');
            console.log('- rotationSchedule keys:', typeof user.rotationSchedule === 'object' ? Object.keys(user.rotationSchedule) : 'not an object');
            console.log('- oralExamScore type:', typeof user.oralExamScore);
        }
        
    } catch (error) {
        console.error('Error showing API structure:', error);
    }
}

// Run if called directly
if (require.main === module) {
    showApiStructure();
}

module.exports = showApiStructure;
