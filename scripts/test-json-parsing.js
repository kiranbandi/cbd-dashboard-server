const { User } = require('../helpers/mariadb');

async function testJsonParsing() {
    try {
        console.log('Testing JSON field parsing...');
        
        // Get a sample user to test JSON parsing
        const user = await User.findOne({
            where: { accessType: 'resident' },
            attributes: ['username', 'ccFeedbackList', 'rotationSchedule', 'longitudinalSchedule']
        });
        
        if (user) {
            console.log('Sample user found:', user.username);
            console.log('ccFeedbackList type:', typeof user.ccFeedbackList);
            console.log('ccFeedbackList value:', user.ccFeedbackList);
            console.log('rotationSchedule type:', typeof user.rotationSchedule);
            console.log('rotationSchedule value:', user.rotationSchedule);
            console.log('longitudinalSchedule type:', typeof user.longitudinalSchedule);
            console.log('longitudinalSchedule value:', user.longitudinalSchedule);
            
            // Test if the values are proper JSON objects/arrays
            if (Array.isArray(user.ccFeedbackList)) {
                console.log('✅ ccFeedbackList is properly parsed as an array');
            } else {
                console.log('❌ ccFeedbackList is not an array:', typeof user.ccFeedbackList);
            }
            
            if (typeof user.rotationSchedule === 'object' && user.rotationSchedule !== null) {
                console.log('✅ rotationSchedule is properly parsed as an object');
            } else {
                console.log('❌ rotationSchedule is not an object:', typeof user.rotationSchedule);
            }
            
        } else {
            console.log('No resident users found');
        }
        
    } catch (error) {
        console.error('Error testing JSON parsing:', error);
    }
}

// Run if called directly
if (require.main === module) {
    testJsonParsing();
}

module.exports = testJsonParsing;
