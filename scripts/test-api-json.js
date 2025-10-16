const { User } = require('../helpers/mariadb');

async function testApiJsonResponse() {
    try {
        console.log('Testing API JSON response format...');
        
        // Simulate the same query that the API endpoint uses (corrected to match original)
        const users = await User.findAll({
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
            ],
            limit: 3
        });
        
        console.log(`Found ${users.length} users`);
        
        for (const user of users) {
            console.log(`\nUser: ${user.username}`);
            console.log('ccFeedbackList type:', typeof user.ccFeedbackList);
            console.log('ccFeedbackList is array:', Array.isArray(user.ccFeedbackList));
            console.log('rotationSchedule type:', typeof user.rotationSchedule);
            console.log('rotationSchedule is object:', typeof user.rotationSchedule === 'object' && user.rotationSchedule !== null);
            console.log('oralExamScore type:', typeof user.oralExamScore);
            console.log('oralExamScore is object:', typeof user.oralExamScore === 'object' && user.oralExamScore !== null);
            
            // Test JSON serialization (what the API would return)
            const jsonString = JSON.stringify(user);
            const parsed = JSON.parse(jsonString);
            
            console.log('After JSON serialization/parsing:');
            console.log('ccFeedbackList type:', typeof parsed.ccFeedbackList);
            console.log('ccFeedbackList is array:', Array.isArray(parsed.ccFeedbackList));
            console.log('rotationSchedule type:', typeof parsed.rotationSchedule);
            console.log('rotationSchedule is object:', typeof parsed.rotationSchedule === 'object' && parsed.rotationSchedule !== null);
            console.log('oralExamScore type:', typeof parsed.oralExamScore);
            console.log('oralExamScore is object:', typeof parsed.oralExamScore === 'object' && parsed.oralExamScore !== null);
        }
        
        console.log('\n✅ JSON parsing test completed successfully!');
        
    } catch (error) {
        console.error('Error testing API JSON response:', error);
    }
}

// Run if called directly
if (require.main === module) {
    testApiJsonResponse();
}

module.exports = testApiJsonResponse;
