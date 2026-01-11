const API_KEY = 'AIzaSyDsNTgkIe4OiRFKEPTp9EnheIXMaRpoZOA';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const getApiKey = () => {
    // Force use of hardcoded key to ensure it works
    return API_KEY;
};

export const sendMessageToAi = async (message) => {
    try {
        const key = getApiKey();
        const response = await fetch(`${API_URL}?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `You are a helpful, motivating study assistant named Struktify AI. 
                        If the user asks to add a task, start your response with the command: [ADD_TASK:task_text:priority]. 
                        Priority can be 'high', 'medium', or 'low'. Default to 'medium' if not specified.
                        Example: User "add study high priority" -> Response "[ADD_TASK:study:high] Added 'study' to your high priority list! 🚀"
                        Keep normal responses concise (under 50 words) and encouraging. User says: ${message}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`API Error (${response.status}):`, errorText);
            throw new Error(`API request failed: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm thinking...";

        return {
            id: Date.now(),
            text: reply,
            sender: 'ai',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("Gemini API Error:", error);
        return {
            id: Date.now(),
            text: `Connection Error: ${error.message}. Please check your internet or API key quota.`,
            sender: 'ai',
            timestamp: new Date().toISOString()
        };
    }
};

export const generateSchedule = async (tasks, availability = "today") => {
    try {
        const key = getApiKey();
        const tasksJson = JSON.stringify(tasks.filter(t => !t.completed).map(t => ({ text: t.text, priority: t.priority, deadline: t.deadline })));
        const prompt = `
            Create a study schedule for these tasks: ${tasksJson}.
            User availability: ${availability}.
            Sort tasks by priority (High > Medium > Low) and deadline.
            Fit them into the availability window. Allocate realistic time slots (e.g., 25-45 mins) with 5-10 min breaks.
            Return ONLY a valid JSON array with this structure (no markdown, no code blocks):
            [
                { "time": "10:00 AM - 10:30 AM", "task": "Task Name", "type": "work", "priority": "high" },
                { "time": "10:30 AM - 10:35 AM", "task": "Break", "type": "break" }
            ]
        `;

        const response = await fetch(`${API_URL}?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";

        // Clean up markdown if present
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const scheduleData = JSON.parse(text);

        return {
            id: Date.now(),
            text: "Here is your optimized schedule based on your availability:",
            sender: 'ai',
            isSchedule: true,
            data: scheduleData,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("Gemini Schedule Error:", error);
        return {
            id: Date.now(),
            text: "I couldn't generate a schedule right now. Please try again.",
            sender: 'ai',
            timestamp: new Date().toISOString()
        };
    }
};

export const suggestResources = async (subject) => {
    try {
        const key = getApiKey();
        const prompt = `
            Suggest 3-5 high-quality study resources for: "${subject}".
            Include a mix of:
            1. 📚 Books (Title & Author)
            2. 📺 YouTube Channels/Videos
            3. 🌐 Websites/Courses
            Format as a concise markdown list with emojis.
        `;

        const response = await fetch(`${API_URL}?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        if (!response.ok) throw new Error('API request failed');

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "No resources found.";

        return {
            id: Date.now(),
            text: reply,
            sender: 'ai',
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("Gemini Resources Error:", error);
        return {
            id: Date.now(),
            text: "I couldn't find resources right now. Please try again.",
            sender: 'ai',
            timestamp: new Date().toISOString()
        };
    }
};
