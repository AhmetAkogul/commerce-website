async function testAI(text) {
    const prompt = `Task: Complete the e-commerce search query. Give ONLY 1 or 2 words.
Input: erke
Output: erkek mont
Input: pija
Output: pijama takımı
Input: ${text}
Output:`;

console.log("Gönderilen prompt:\n" + prompt);

    try {
        const response = await fetch(
            "https://router.huggingface.co/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer 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",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "Qwen/Qwen2.5-72B-Instruct",
                    messages: [{role: "user", content: prompt}],
                    max_tokens: 5,
                    temperature: 0.1
                })
            }
        );

        const rawData = await response.text();
        console.log("Status:", response.status, response.statusText);
        console.log("Raw Response:", rawData);
    } catch(err) {
        console.error(err);
    }
}

testAI("bilg").then(()=>console.log("Test bitti."));
