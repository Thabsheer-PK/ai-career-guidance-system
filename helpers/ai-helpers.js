// helpers/ai-helpers.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with API key from .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the model ONCE here
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function getRecommendations(userData) {
  try {
    const prompt = `
You are an AI that must generate HTML content ONLY. 
Return strictly valid HTML without any extra text, markdown, or comments. 
Do not include "<html>", "<head>", or "<body>" tags—only the content block below.

Content rules:
- Wrap the entire output inside <div class="recommendation-content"> ... </div>.
- Use <section>, <div>, <span>, and meaningful class names for styling.
- Do not add anything outside tags.
- Each section should look like a professional recommendation dashboard.

Student Profile:
- Name: ${userData.name || 'Not provided'}
- Age: ${userData.age || 'Not provided'}
- Education Level: ${userData.educationLevel || 'Not provided'}
- Grade: ${userData.grade || 'Not provided'}%
- Favorite Subjects: ${userData.subjects || 'Not provided'}
- Weak Subjects: ${userData.weakSubjects || 'Not provided'}
- Interests: ${userData.interests || 'Not provided'}
- Skills: ${Array.isArray(userData.skills) ? userData.skills.join(", ") : userData.skills || 'Not provided'}
- Personality: ${userData.personality || 'Not provided'}
- Career Goal: ${userData.careerGoal || 'Not provided'}
- Preferred Location: ${userData.location || 'Not provided'}
- Language: ${userData.language || 'Not provided'}
- Weekly Availability: ${userData.availability || 'Not provided'} hours
- Preferred Learning Style: ${userData.learningStyle || 'Not provided'}
- Roadmap output must be in bullet short points 
- when filling college fee amount, it must be a value, any string or blank is not allowed specify its and show near by amount (per) " /year"

Output format (strict HTML only):

<div class="recommendation-content">
  <div class="introductory">
    <p>Welcome, ${userData.name || 'Student'}! This personalized career guidance is based on your profile to help you explore suitable paths and educational options.</p>
  </div>

  <section class="career-section">
    <h3 class="section-title">Top 3 Career Paths</h3>
    <ol class="career-list">
      <li class="career-item"><b class="career-name">Career Name 1</b> <span class="career-desc">– why it suits the student</span> <span class="career-badge">Recommended</span></li>
      <li class="career-item"><b class="career-name">Career Name 2</b> <span class="career-desc">– why it suits the student</span></li>
      <li class="career-item"><b class="career-name">Career Name 3</b> <span class="career-desc">– why it suits the student</span></li>
    </ol>
  </section>

  <section class="college-section">
    <h3 class="section-title">Best Colleges (near ${userData.location || 'the student’s preferred location'})</h3>
    <ul class="college-list">
      <li class="college-item"><b class="college-name">College Name 1</b> – <span class="college-fee">₹xxx</span> – <span class="college-course">Course Name</span> – <a class="college-link" href="url">Website</a></li>
      <li class="college-item"><b class="college-name">College Name 2</b> – <span class="college-fee">₹xxx</span> – <span class="college-course">Course Name</span> – <a class="college-link" href="url">Website</a></li>
      <li class="college-item"><b class="college-name">College Name 3</b> – <span class="college-fee">₹xxx</span> – <span class="college-course">Course Name</span> – <a class="college-link" href="url">Website</a></li>
    </ul>
  </section>


<section class="learning-path">
  <h3 class="section-title">Suggested Learning Path for Your Goal</h3>
  <div class="roadmap">
    <!-- AI will generate output here -->
    <!-- Example format AI must follow:
    <!-- only use this classes, because this classes have css 
    <div class="roadmap-step">
      <h4>Stage Title</h4>
      <p>Short explanation...</p>
      <ul>
        <li>Milestone 1</li>
        <li>Milestone 2</li>
      </ul>
    </div>
    -->
  </div>
</section>



  <div class="outro">
    <p>Thank you for using AI-CareerGuide! We hope this guidance helps you take the next step toward your future. Feel free to retake the test or explore more options.</p>
  </div>
</div>

your output is strictly use above, nothing add anything else;
`;


    const result = await model.generateContent(prompt);
    const rawOutput = result.response.text();
    console.log('Raw Gemini Output:', rawOutput); // Log to verify
    return rawOutput;
  } catch (err) {
    console.error("Gemini API error:", err);
    throw err;
  }
}

module.exports = { getRecommendations };
