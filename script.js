// Get references to DOM elements
const chatBtn = document.getElementById('chat-btn');
const chatNowBtn = document.getElementById('chat-now-btn');
const closeChatBtn = document.getElementById('close-chat-btn');
const chatbotContainer = document.getElementById('chatbot-container');
const chatbotMessages = document.getElementById('chatbot-messages');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');

// Initialize chat step and user details storage
let chatStep = 0;
const userDetails = {};

// Define the chatbot conversation flow
const chatFlow = [
    {
        prompt: "Hello! I'm your Land Registration Assistant. I'll help you connect with a verified agent near your area to solve any issue related to land registration.",
        followUp: "May I know your full name to get started?",
        key: "name"
    },
    {
        prompt: "Can you share your phone number so our team can call you for assistance?",
        key: "phone"
    },
    {
        prompt: "Would you like to provide your email ID for updates and status tracking? (optional)",
        key: "email"
    },
    {
        prompt: "To find an agent near you, please provide your location details.",
        questions: [
            "Which city or district is your property located in?",
            "Can you also mention your area name or PIN code?"
        ],
        key: "location"
    },
    {
        prompt: "Please tell me what kind of support you need. You can select one or more options.",
        options: ["Land Registration Assistance", "Patta / Chitta Help", "EC & Document Verification", "Buying / Selling Land Support", "Survey / Subdivision Help", "Other Issue"],
        key: "service"
    },
    {
        prompt: "Could you briefly explain what problem you're facing?",
        key: "problem"
    },
    {
        prompt: "When would you prefer our team to call you for further discussion?",
        options: ["Morning (9 AM – 12 PM)", "Afternoon (12 PM – 4 PM)", "Evening (4 PM – 8 PM)"],
        key: "callTime"
    },
    {
        prompt: "Thank you, {name}! Here's what we'll do next:",
        confirmation: true
    }
];

// Function to open the chatbot
const openChatbot = () => {
    gsap.fromTo(chatbotContainer, {x: "100%", opacity: 0}, {x: 0, opacity: 1, duration: 0.5, onStart: () => chatbotContainer.classList.remove('hidden')});
    startChat();
};

// Function to close the chatbot
const closeChatbot = () => {
    gsap.to(chatbotContainer, {x: "100%", opacity: 0, duration: 0.5, onComplete: () => chatbotContainer.classList.add('hidden')});
};

// Function to start the chat conversation
const startChat = () => {
    chatStep = 0;
    chatbotMessages.innerHTML = ''; // Clear previous messages
    displayBotMessage(chatFlow[chatStep].prompt);
    if (chatFlow[chatStep].followUp) {
        setTimeout(() => displayBotMessage(chatFlow[chatStep].followUp), 1000);
    }
};

// Function to display a message from the bot
const displayBotMessage = (message) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('bot-message');
    messageElement.innerText = message;
    chatbotMessages.appendChild(messageElement);
    gsap.from(messageElement, {opacity: 0, y: 20, duration: 0.5});
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
};

// Function to display a message from the user
const displayUserMessage = (message) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('user-message');
    messageElement.innerText = message;
    chatbotMessages.appendChild(messageElement);
    gsap.from(messageElement, {opacity: 0, y: 20, duration: 0.5});
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight; // Scroll to bottom
};

// Function to handle user input
const handleUserInput = () => {
    const message = userInput.value.trim();
    if (message) {
        displayUserMessage(message);
        userInput.value = ''; // Clear input field
        processUserInput(message);
    }
};

// Function to process user input and advance chat flow
const processUserInput = (message) => {
    const currentStep = chatFlow[chatStep];
    userDetails[currentStep.key] = message; // Store user's response

    chatStep++; // Move to next step in chat flow

    if (chatStep < chatFlow.length) {
        const nextStep = chatFlow[chatStep];
        if (nextStep.prompt) {
            displayBotMessage(nextStep.prompt);
        }
        if (nextStep.options) {
            displayOptions(nextStep.options);
        }
        if (nextStep.confirmation) {
            displayConfirmation();
        }
    } else {
        endChat(); // End chat if no more steps
    }
};

// Function to display options as buttons
const displayOptions = (options) => {
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('options-container');
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.addEventListener('click', () => {
            processUserInput(option);
            optionsContainer.remove(); // Remove options after selection
        });
        optionsContainer.appendChild(button);
    });
    chatbotMessages.appendChild(optionsContainer);
};

// Function to display confirmation message
const displayConfirmation = () => {
    const message = chatFlow[chatStep - 1].prompt.replace('{name}', userDetails.name);
    displayBotMessage(message);
    displayBotMessage("Our team will review your request.");
    displayBotMessage("You'll receive a call soon from our representative.");
    displayBotMessage("A verified agent from your area will be assigned to solve your issue.");
    setTimeout(endChat, 3000); // End chat after a delay
};

// Function to end the chat conversation
const endChat = () => {
    displayBotMessage("You'll also get updates on WhatsApp or email. Thank you for contacting us — we'll make your land registration easy and stress-free!");
    userInput.disabled = true; // Disable user input
    sendBtn.disabled = true; // Disable send button

    for (let i = 0; i < 100; i++) {
        createConfetti();
    }
};

const createConfetti = () => {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti');
    chatbotContainer.appendChild(confetti);

    gsap.fromTo(confetti, {
        x: Math.random() * chatbotContainer.offsetWidth,
        y: -20,
        scale: Math.random() * 0.5 + 0.5,
        opacity: 1
    }, {
        y: chatbotContainer.offsetHeight + 20,
        x: '+=Math.random() * 100 - 50',
        rotation: Math.random() * 360,
        duration: Math.random() * 2 + 3,
        ease: "power1.out",
        onComplete: () => {
            confetti.remove();
        }
    });
};

// Event listeners for chat buttons and user input
chatBtn.addEventListener('click', openChatbot);
chatNowBtn.addEventListener('click', openChatbot);
closeChatBtn.addEventListener('click', closeChatbot);
sendBtn.addEventListener('click', handleUserInput);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleUserInput();
    }
});

// Dark theme toggle functionality
const themeSwitch = document.getElementById('checkbox');

const currentTheme = localStorage.getItem('theme');

if (currentTheme) {
    document.body.classList.add(currentTheme);

    if (currentTheme === 'dark-theme') {
        themeSwitch.checked = true;
    }
}

function switchTheme(e) {
    if (e.target.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', '');
    }
}

themeSwitch.addEventListener('change', switchTheme, false);
