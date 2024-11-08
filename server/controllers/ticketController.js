const fs = require('fs').promises;
const path = require('path');
const ticketController = {};

const OpenAI = require("openai");
const openai = new OpenAI({
  apiKey: process.env.GPT_SECRET_KEY,
});


ticketController.fileSearch = async (req, res, next) => {
    const { patentID, name } = req.body;

    const patentData = JSON.parse(await fs.readFile(path.join(__dirname, '../../public/patents.json'), 'utf-8'));
    const companyData = JSON.parse(await fs.readFile(path.join(__dirname, '../../public/company_products.json'), 'utf-8'));

    const matchedPatents = patentData.filter(item => item.publication_number.toLowerCase() === patentID.toLowerCase())
    const matchedCompanies = companyData.companies.filter(item => item.name.toLowerCase().includes(name.toLowerCase()))

        
    // Check if any matches were found
    if (matchedPatents.length === 0 || matchedCompanies.length === 0) {
        return res.status(404).json({ message: 'No match found' });
    }

    // Now safely access properties if matches were found
    if (!matchedPatents[0].abstract || !matchedCompanies[0].products) {
        return res.status(404).json({ message: 'No match found' });
    }

    const payload = {
        abstract: matchedPatents[0].abstract,
        products : matchedCompanies[0].products
    }


    res.locals.payload = payload
    next();
}

ticketController.checkInfringement = async (req, res, next) => {
        const { payload } = res.locals;
        const [ abstract, products ] = [ payload.abstract, payload.products]

        try {
            
            const prompt = `
            Given the following abstract about a product: "${abstract}",
            please identify the **two products** from the list below (${products.map(p => `${p.name}: ${p.description}`).join(", ")}) that most closely align with the functionality described in the abstract. 
            For each of the selected products, provide the following details:
            - **product_name**: the name of the product
            - **infringement_likelihood**: Rate the likelihood of infringement as ["High", "Moderate", "Low"]
            - **explanation**: A brief explanation of why this product aligns with the abstract's features and functionality.
            - **specific_features**: List specific features that make this product similar to the abstract's described functionality.
            
            Additionally, provide an overall **risk assessment** for the alignment of the two products with the abstract. Present your response in the following JSON format:
            
            {
                "top_infringing_products": [
                    {
                        "product_name": "<product name>",
                        "infringement_likelihood": ["High", "Moderate", "Low"],
                        "explanation": "<brief explanation>",
                        "specific_features": ["<feature 1>", "<feature 2>", ...]
                    },
                    {
                        "product_name": "<product name>",
                        "infringement_likelihood": ["High", "Moderate", "Low"],
                        "explanation": "<brief explanation>",
                        "specific_features": ["<feature 1>", "<feature 2>", ...]
                    }
                ],
                "overall_risk_assessment": "<summary of overall risk>"
            }
            Make sure to include the full structure as shown above, ensuring each field is properly filled out with the relevant details.
            `;

            const response = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt}],
                temperature: 1,
                max_tokens: 2048,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
              });

            const message = response.choices[0].message.content;

            res.locals.infringingProductArray = JSON.parse(message)
            return next();

        } catch (err) {
            console.error('Error Details:', err)
            return next({
                log: 'failed to fetch ai response',
                message: {err: `the error code: ${err}`}
            });
        }


}


module.exports = ticketController;