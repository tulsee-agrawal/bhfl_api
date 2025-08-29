const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// 🔧 IMPORTANT: CHANGE THESE TO YOUR DETAILS!
const USER_DETAILS = {
    full_name: "tulsee_agrawal", // ← Change to YOUR name (lowercase, use _ for spaces)
    birth_date: "11032004", // ← Change to YOUR birth date (ddmmyyyy format)
    email: "tulseeagrawal1103@gmail.com", // ← Change to YOUR email
    roll_number: "22BCE0438" // ← Change to YOUR college roll number
};

// Helper functions
function isNumeric(str) {
    return !isNaN(str) && !isNaN(parseFloat(str));
}

function isAlphabetic(str) {
    return /^[a-zA-Z]+$/.test(str);
}

function isSpecialCharacter(str) {
    return /^[^a-zA-Z0-9]+$/.test(str);
}

function createAlternatingCaps(alphabets) {
    let allChars = alphabets.join('').toLowerCase();
    let reversed = allChars.split('').reverse().join('');
    let result = '';
    for (let i = 0; i < reversed.length; i++) {
        if (i % 2 === 0) {
            result += reversed[i].toLowerCase();
        } else {
            result += reversed[i].toUpperCase();
        }
    }
    return result;
}

// Main API endpoint - POST /bfhl
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input: 'data' should be an array"
            });
        }
        
        const oddNumbers = [];
        const evenNumbers = [];
        const alphabets = [];
        const specialCharacters = [];
        let sum = 0;
        
        data.forEach(item => {
            const itemStr = String(item);
            
            if (isNumeric(itemStr)) {
                const num = parseInt(itemStr);
                if (num % 2 === 0) {
                    evenNumbers.push(itemStr);
                } else {
                    oddNumbers.push(itemStr);
                }
                sum += num;
            } else if (isAlphabetic(itemStr)) {
                alphabets.push(itemStr.toUpperCase());
            } else if (isSpecialCharacter(itemStr)) {
                specialCharacters.push(itemStr);
            }
        });
        
        const concatString = createAlternatingCaps(alphabets);
        
        const response = {
            is_success: true,
            user_id: `${USER_DETAILS.full_name}_${USER_DETAILS.birth_date}`,
            email: USER_DETAILS.email,
            roll_number: USER_DETAILS.roll_number,
            odd_numbers: oddNumbers,
            even_numbers: evenNumbers,
            alphabets: alphabets,
            special_characters: specialCharacters,
            sum: sum.toString(),
            concat_string: concatString
        };
        
        res.status(200).json(response);
        
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

// GET endpoint for testing
app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1
    });
});

// Health check
app.get('/', (req, res) => {
    res.status(200).json({
        message: "BFHL API is running!",
        endpoints: {
            "POST /bfhl": "Main API endpoint",
            "GET /bfhl": "Operation code endpoint"
        }
    });
});

app.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/bfhl`);
});