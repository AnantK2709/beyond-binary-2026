export async function askQuestion(question) {
    console.log(question)
    try {
        const res = await fetch("http://localhost:5001/api/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ question }),
        });

        if (!res.ok) {
            // Parse error message from server if available
            const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
            throw new Error(errorData.error || `Server error: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        // Network errors, parse errors, etc.
        console.error("Ask question error:", error);
        throw error; // Re-throw so caller can handle it
    }
}