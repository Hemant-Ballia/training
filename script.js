// Ensure the DOM is fully loaded before executing the script
document.addEventListener("DOMContentLoaded", () => {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger, SplitText, ScrollSmoother);

  // Initialize ScrollSmoother
  const smoother = ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 1.5,
    effects: true,
  });

  // Animate hero section title
  const heroTitle = new SplitText(".hero h1", { type: "chars" });
  gsap.from(heroTitle.chars, {
    opacity: 0,
    y: 20,
    duration: 0.5,
    stagger: 0.05,
    delay: 0.5,
  });

  // Animate other hero section elements
  gsap.from(".hero p", { opacity: 0, y: 20, duration: 1, delay: 0.8 });
  gsap.from(".hero button", { opacity: 0, y: 20, duration: 1, delay: 1.1 });

  // Animate navigation links
  gsap.from("nav ul li", {
    opacity: 0,
    y: -10,
    duration: 0.5,
    stagger: 0.2,
    delay: 0.2,
  });

  // Add hover animations to all buttons
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("mouseover", () =>
      gsap.to(button, { scale: 1.05, duration: 0.3 })
    );
    button.addEventListener("mouseout", () =>
      gsap.to(button, { scale: 1, duration: 0.3 })
    );
  });

  // Add hover animations to navigation links
  const navLinks = document.querySelectorAll("nav ul li a");
  navLinks.forEach((link) => {
    link.addEventListener("mouseover", () =>
      gsap.to(link, { y: -3, duration: 0.3 })
    );
    link.addEventListener("mouseout", () =>
      gsap.to(link, { y: 0, duration: 0.3 })
    );
  });

  // Animate sections on scroll
  gsap.from("#how-it-works .step", {
    scrollTrigger: "#how-it-works",
    opacity: 0,
    y: 50,
    duration: 0.6,
    stagger: 0.3,
  });

  gsap.from("#why-us ul li", {
    scrollTrigger: "#why-us",
    opacity: 0,
    x: -50,
    duration: 0.6,
    stagger: 0.3,
  });

  gsap.from("#agents p", {
    scrollTrigger: "#agents",
    opacity: 0,
    y: 50,
    duration: 0.6,
    stagger: 0.3,
  });

  // Back to Top Button functionality
  const backToTopBtn = document.getElementById("back-to-top-btn");

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", (e) => {
      e.preventDefault();
      if (smoother) {
        smoother.scrollTo(0, true);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    document.addEventListener("scroll", () => {
      const scrollTop = smoother ? smoother.scrollTop() : window.scrollY;
      if (scrollTop > 300) {
        backToTopBtn.classList.remove("hidden");
        backToTopBtn.classList.add("visible");
      } else {
        backToTopBtn.classList.add("hidden");
        backToTopBtn.classList.remove("visible");
      }
    });
  }

  // Get references to chatbot elements
  const chatBtn = document.getElementById("chat-btn");
  const chatNowBtn = document.getElementById("chat-now-btn");
  const closeChatBtn = document.getElementById("close-chat-btn");
  const chatbotContainer = document.getElementById("chatbot-container");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");

  let chatStep = 0;
  const userDetails = {};

  // Chatbot conversation flow
  const chatFlow = [
    {
      prompt:
        "Hello! I'm your Land Registration Assistant. I'll help you connect with a verified agent near your area to solve any issue related to land registration.",
      followUp: "May I know your full name to get started?",
      key: "name",
    },
    {
      prompt:
        "Can you share your phone number so our team can call you for assistance?",
      key: "phone",
    },
    {
      prompt:
        "Would you like to provide your email ID for updates and status tracking? (optional)",
      key: "email",
    },
    {
      prompt:
        "To find an agent near you, please provide your location details.",
      questions: [
        "Which city or district is your property located in?",
        "Can you also mention your area name or PIN code?",
      ],
      key: "location",
    },
    {
      prompt:
        "Please tell me what kind of support you need. You can select one or more options.",
      options: [
        "Land Registration Assistance",
        "Patta / Chitta Help",
        "EC & Document Verification",
        "Buying / Selling Land Support",
        "Survey / Subdivision Help",
        "Other Issue",
      ],
      key: "service",
    },
    {
      prompt: "Could you briefly explain what problem you're facing?",
      key: "problem",
    },
    {
      prompt:
        "When would you prefer our team to call you for further discussion?",
      options: [
        "Morning (9 AM – 12 PM)",
        "Afternoon (12 PM – 4 PM)",
        "Evening (4 PM – 8 PM)",
      ],
      key: "callTime",
    },
    {
      prompt: "Thank you, {name}! Here's what we'll do next:",
      confirmation: true,
    },
  ];

  const openChatbot = () => {
    gsap.fromTo(
      chatbotContainer,
      { x: "100%", opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.5,
        onStart: () => chatbotContainer.classList.remove("hidden"),
      }
    );
    startChat();
  };

  const closeChatbot = () => {
    gsap.to(chatbotContainer, {
      x: "100%",
      opacity: 0,
      duration: 0.5,
      onComplete: () => chatbotContainer.classList.add("hidden"),
    });
  };

  const startChat = () => {
    chatStep = 0;
    chatbotMessages.innerHTML = "";
    displayBotMessage(chatFlow[chatStep].prompt);
    if (chatFlow[chatStep].followUp) {
      setTimeout(() => displayBotMessage(chatFlow[chatStep].followUp), 1000);
    }
  };

  const displayBotMessage = (message) => {
    const msg = document.createElement("div");
    msg.classList.add("bot-message");
    msg.innerText = message;
    chatbotMessages.appendChild(msg);
    gsap.from(msg, { opacity: 0, y: 20, duration: 0.5 });
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  const displayUserMessage = (message) => {
    const msg = document.createElement("div");
    msg.classList.add("user-message");
    msg.innerText = message;
    chatbotMessages.appendChild(msg);
    gsap.from(msg, { opacity: 0, y: 20, duration: 0.5 });
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  const handleUserInput = () => {
    const message = userInput.value.trim();
    if (message) {
      displayUserMessage(message);
      userInput.value = "";
      processUserInput(message);
    }
  };

  const processUserInput = (message) => {
    const currentStep = chatFlow[chatStep];
    userDetails[currentStep.key] = message;
    chatStep++;
    if (chatStep < chatFlow.length) {
      const next = chatFlow[chatStep];
      if (next.prompt) displayBotMessage(next.prompt);
      if (next.options) displayOptions(next.options);
      if (next.confirmation) displayConfirmation();
    } else {
      endChat();
    }
  };

  const displayOptions = (options) => {
    const container = document.createElement("div");
    container.classList.add("options-container");
    options.forEach((option) => {
      const btn = document.createElement("button");
      btn.innerText = option;
      btn.addEventListener("click", () => {
        processUserInput(option);
        container.remove();
      });
      container.appendChild(btn);
    });
    chatbotMessages.appendChild(container);
  };

  const displayConfirmation = () => {
    const message = chatFlow[chatStep - 1].prompt.replace(
      "{name}",
      userDetails.name
    );
    displayBotMessage(message);
    displayBotMessage("Our team will review your request.");
    displayBotMessage("You'll receive a call soon from our representative.");
    displayBotMessage(
      "A verified agent from your area will be assigned to solve your issue."
    );
    setTimeout(endChat, 3000);
  };

  const endChat = () => {
    displayBotMessage(
      "You'll also get updates on WhatsApp or email. Thank you for contacting us — we'll make your land registration easy and stress-free!"
    );
    userInput.disabled = true;
    sendBtn.disabled = true;
    for (let i = 0; i < 100; i++) createConfetti();
  };

  const createConfetti = () => {
    const confetti = document.createElement("div");
    confetti.classList.add("confetti");
    chatbotContainer.appendChild(confetti);
    gsap.fromTo(
      confetti,
      {
        x: Math.random() * chatbotContainer.offsetWidth,
        y: -20,
        scale: Math.random() * 0.5 + 0.5,
        opacity: 1,
      },
      {
        y: chatbotContainer.offsetHeight + 20,
        x: "+=Math.random() * 100 - 50",
        rotation: Math.random() * 360,
        duration: Math.random() * 2 + 3,
        ease: "power1.out",
        onComplete: () => confetti.remove(),
      }
    );
  };

  if (chatBtn) chatBtn.addEventListener("click", openChatbot);
  if (chatNowBtn) chatNowBtn.addEventListener("click", openChatbot);
  if (closeChatBtn) closeChatBtn.addEventListener("click", closeChatbot);
  if (sendBtn) sendBtn.addEventListener("click", handleUserInput);
  if (userInput)
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleUserInput();
    });

  // 🌞 New Sun-Moon Animated Theme Switcher
  let wr = document.querySelector(".wrapper");
  let bg = document.querySelector(".background");
  let bg2 = document.querySelector(".background-2");
  let sun = document.querySelector(".sun");
  let circles = document.querySelectorAll(".sun-circle");
  let spots = document.querySelectorAll(".sun-spot");
  let flag = false;

  if (wr) {
    wr.addEventListener("click", () => {
      bg.classList.toggle("background_active", !flag);
      bg2.classList.toggle("background-2_active", !flag);
      wr.classList.toggle("wrapper_active", !flag);
      sun.classList.toggle("sun_active", !flag);
      circles[0].classList.toggle("sun-circle_active", !flag);
      circles[1].classList.toggle("sun-circle-two_active", !flag);
      circles[2].classList.toggle("sun-circle-three_active", !flag);
      spots.forEach((s) => s.classList.toggle("sun-spot_active", !flag));
      document.body.classList.toggle("dark-theme", !flag);
      flag = !flag;
    });
  }
});
