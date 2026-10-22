
import { useEffect, useState } from "react";
import "./App.css";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001";

const initialBrandPolicies = {
  BottleCare: {
    refund: "Refunds are permitted within 7 days of delivery.",
    returns: "Damaged products must be reported within 7 days.",
    shipping: "Standard shipping takes 3–5 business days.",
    cancellation: "Orders can be cancelled before dispatch."
  },
  PureLiving: {
    refund: "Refunds are permitted within 14 days of delivery.",
    returns: "Damaged products must be reported within 48 hours.",
    shipping: "Standard shipping takes 5–7 business days.",
    cancellation: "Orders can be cancelled within 30 minutes."
  }
};


const initialMessages = [
  {
    id: 1,
    sender: "customer",
    text: "Hi, I need some help with my recent order.",
    time: "10:30 AM"
  },
  {
    id: 2,
    sender: "agent",
    text: "Hello! I'd be happy to help. What seems to be the issue?",
    time: "10:31 AM"
  },
  {
    id: 3,
    sender: "customer",
    text: "My order was delivered but the bottle is broken. What can I do?",
    time: "10:32 AM"
  }
];

function getCurrentTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

export default function App() {
  const [brand, setBrand] = useState("BottleCare");
  const [activityLogs, setActivityLogs] = useState([]);
  const [brandPolicies, setBrandPolicies] = useState(() => {
  const savedPolicies = localStorage.getItem("brandPolicies");

  return savedPolicies
    ? JSON.parse(savedPolicies)
    : initialBrandPolicies;
  });
  useEffect(() => {
  localStorage.setItem(
    "brandPolicies",
    JSON.stringify(brandPolicies)
  );
  }, [brandPolicies]);
  const [messagesByBrand, setMessagesByBrand] = useState({
    BottleCare: initialMessages,
    PureLiving: [
      {
        id: 4,
        sender: "customer",
        text: "Hello, can you help me with my order?",
        time: "10:35 AM"
      }
    ]
  });

  const [side, setSide] = useState("customer");
  const [draft, setDraft] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [apiStatus, setApiStatus] = useState("Checking...");
  const [retrievedPolicy, setRetrievedPolicy] = useState("");

  const messages = messagesByBrand[brand] || [];


  useEffect(() => {
    fetch(`${API_BASE_URL}/api/health`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend unavailable");
        }
        return response.json();
      })
      .then((data) => {
        setApiStatus(
          data.status === "healthy" ? "Connected" : "Unavailable"
        );
      })
      .catch(() => setApiStatus("Disconnected"));
  }, []);



  function sendMessage(event) {
    event.preventDefault();

    const text = draft.trim();
    if (!text) return;

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sender: side,
      text,
      time: getCurrentTime()
    };

    const updatedMessages = [
      ...(messagesByBrand[brand] || []),
      message
    ];

    setMessagesByBrand((previous) => ({
      ...previous,
      [brand]: updatedMessages
    }));

    setDraft("");
    setSuggestion("");
    setRetrievedPolicy("");

    // Generate a reply automatically for customer messages.
    if (side === "customer") {
      generateDemoReply(updatedMessages);
    }
  }




  async function generateDemoReply(currentMessages = messages) {
    if (!Array.isArray(currentMessages)) {
    currentMessages = messages;
    }
    const latestCustomerMessage = [...currentMessages]
      .reverse()
      .find((message) => message.sender === "customer");

    if (!latestCustomerMessage) {
      setSuggestion(
        "No customer message is available. Switch to Customer and send a message first."
      );
      setRetrievedPolicy("");
      return;
    }

  
const policies = brandPolicies[brand];
const question = latestCustomerMessage.text.toLowerCase();

const matchedPolicies = [];

if (
  question.includes("broken") ||
  question.includes("damaged") ||
  question.includes("defective")
) {
  matchedPolicies.push(`Returns policy: ${policies.returns}`);
}

if (question.includes("refund")) {
  matchedPolicies.push(`Refund policy: ${policies.refund}`);
}

if (
  question.includes("ship") ||
  question.includes("delivery") ||
  question.includes("delivered") ||
  question.includes("arrived") ||
  question.includes("delayed") ||
  question.includes("late") ||
  question.includes("arrive")
) {
  matchedPolicies.push(`Shipping policy: ${policies.shipping}`);
}

if (
  question.includes("cancel") ||
  question.includes("cancellation")
) {
  matchedPolicies.push(
    `Cancellation policy: ${policies.cancellation}`
  );
}

const policyContext = matchedPolicies.length
  ? matchedPolicies.join("\n")
  : "No relevant policy was identified. Do not invent an answer. Ask the support team to review the question.";



if (matchedPolicies.length === 0) {
  const fallbackReply = `Thank you for contacting ${brand}. Our current policy does not include information about this request. Our support team will need to review your question and provide accurate information.`;

  setRetrievedPolicy(policyContext);
  setSuggestion(fallbackReply);
  return;
}



    setRetrievedPolicy(policyContext);
    setSuggestion("Generating AI reply...");
    setActivityLogs((previous) => [
  ...previous,
  {
    action: "AI reply requested",
    brand: brand,
    timestamp: new Date().toLocaleString(),
  },
  ]);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/generate-reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            brand,
            customer_message: latestCustomerMessage.text,
            policy_context: policyContext
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "The AI request failed."
        );
      }

      setSuggestion(result.reply);
    } catch (error) {
      console.error("AI reply generation failed:", error);

      setSuggestion(
        `Could not generate an AI reply: ${error.message}. Please try again or respond manually.`
      );
    }
  }


  function approveReply() {
    const text = suggestion.trim();

    if (!text) return;

    const message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      sender: "agent",
      text,
      time: getCurrentTime()
    };

    setMessagesByBrand((previous) => ({
      ...previous,
      [brand]: [...(previous[brand] || []), message]
    }));

    setActivityLogs((previous) => [
  ...previous,
    {
    action: "Reply approved and sent",
    brand: brand,
    timestamp: new Date().toLocaleString(),
    },
    ]);

    setSuggestion("");
    setRetrievedPolicy("");
    setSide("customer");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand-logo">
          <span className="logo-mark">C</span>
          <div>
            <strong>Converse AI</strong>
            <small>Support workspace</small>
          </div>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <button className="nav-item active" type="button">
          ▤ &nbsp; Inbox
        </button>

        <button
          className="nav-item"
          type="button"
          onClick={() =>
            document
              .getElementById("knowledge")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          ◈ &nbsp; Brand knowledge
        </button>

        <div className="sidebar-bottom">
          <div className="avatar">SD</div>
          <div>
            <strong>Support Agent</strong>
            <small>Demo workspace</small>
          </div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <div className="eyebrow">CUSTOMER EXPERIENCE / INBOX</div>
            <h1>Conversation workspace</h1>
          </div>

          <div
            className={`connection ${apiStatus === "Connected" ? "online" : ""
              }`}
          >
            <span className="status-dot" />
            API: {apiStatus}
          </div>
        </header>

        <div className="workspace">
          <section className="conversation-panel">
            <div className="conversation-header">
              <div className="customer-heading">
                <div className="customer-avatar">AM</div>
                <div>
                  <h2>Alex Morgan</h2>
                  <p>Customer · Order #ORD-10482</p>
                </div>
              </div>

              <select
                aria-label="Select brand"
                value={brand}
                onChange={(event) => {
                  setBrand(event.target.value);
                  setSuggestion("");
                  setRetrievedPolicy("");
                }}
              >
                <option value="BottleCare">BottleCare</option>
                <option value="PureLiving">PureLiving</option>
              </select>
            </div>

            <div className="order-card">
              <div className="order-icon">□</div>
              <div className="order-description">
                <strong>Insulated water bottle</strong>
                <span>Qty: 1 · Delivered · ₹1,299</span>
              </div>
              <span className="delivered-badge">Delivered</span>
            </div>

            <div className="message-toolbar">
              <span>CONVERSATION</span>
              <span>{messages.length} messages</span>
            </div>

            <div className="message-list">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`message-row ${message.sender === "agent" ? "agent-row" : ""
                    }`}
                >
                  <div className={`message-avatar ${message.sender}`}>
                    {message.sender === "customer" ? "AM" : "SD"}
                  </div>

                  <div className="message-content">
                    <div className="message-meta">
                      <strong>
                        {message.sender === "customer"
                          ? "Alex Morgan"
                          : "You · Agent"}
                      </strong>
                      <span>{message.time}</span>
                    </div>

                    <div className={`message-bubble ${message.sender}`}>
                      {message.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form className="composer" onSubmit={sendMessage}>
              <div className="composer-toolbar">
                <span>Send as</span>

                <div className="role-toggle">
                  <button
                    type="button"
                    className={side === "customer" ? "selected" : ""}
                    onClick={() => setSide("customer")}
                  >
                    Customer
                  </button>

                  <button
                    type="button"
                    className={side === "agent" ? "selected" : ""}
                    onClick={() => setSide("agent")}
                  >
                    Agent
                  </button>
                </div>
              </div>

              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                placeholder={`Write a message as ${side}...`}
                rows={3}
              />

              <div className="composer-footer">
                <span>Demo conversation · No external message delivery</span>
                <button className="primary-button" type="submit">
                  Send message ↗
                </button>
              </div>
            </form>
          </section>

          <aside className="ai-panel">
            <div className="ai-heading">
              <div className="ai-icon">✳</div>
              <div>
                <h2>AI Reply Assistant</h2>
                <p>Agent stays in control</p>
              </div>
            </div>

            <div className="ai-callout">
              <strong>Suggested workflow</strong>
              <p>
                Generate a draft, check its policy context, edit it, and
                approve before sending.
              </p>
            </div>

            <button
              className="generate-button"
              type="button"
              onClick={generateDemoReply}
            >
              ✳ &nbsp; Generate reply
            </button>

            <div className="draft-label">
              <span>REPLY DRAFT</span>
              <span className="draft-status">Review required</span>
            </div>

            <textarea
              className="reply-editor"
              value={suggestion}
              onChange={(event) => setSuggestion(event.target.value)}
              placeholder="Your suggested response will appear here..."
              rows={7}
            />

            <div className="context-section">
              <div className="context-title">
                <strong>Retrieved policy context</strong>
                <span>DEMO</span>
              </div>

              <p>
                {retrievedPolicy ||
                  "Generate a reply to view the policy selected by the current demo rules."}
              </p>
            </div>

            <div className="guardrail-note">
              <span>✓</span>
              <p>
                Review the policy and customer details before making a refund
                or replacement promise.
              </p>
            </div>

            <button
              className="approve-button"
              type="button"
              onClick={approveReply}
              disabled={!suggestion.trim()}
            >
              Approve &amp; send reply
            </button>

            <p className="demo-note">
              Initial UI demo: reply suggestions use simple rules, not an LLM
              yet.
            </p>

            
<div className="knowledge-preview" id="knowledge">

<div className="knowledge-preview">
  <h3>Activity Logs</h3>
  <p>Recent actions performed in this workspace.</p>

  {activityLogs.length === 0 ? (
    <p>No activity recorded yet.</p>
  ) : (
    activityLogs.slice().reverse().map((log, index) => (
      <div className="policy-item" key={`${log.timestamp}-${index}`}>
        <strong>{log.action}</strong>
        <p>Brand: {log.brand}</p>
        <small>{log.timestamp}</small>
      </div>
    ))
  )}
</div>

  <h3>Brand Knowledge Management</h3>
  <p>Edit the policies for the currently selected brand.</p>

  {Object.entries(brandPolicies[brand]).map(([name, policy]) => (
    <div className="policy-item" key={name}>
      <label htmlFor={`policy-${name}`}>
        {name.charAt(0).toUpperCase() + name.slice(1)} Policy
      </label>

      <textarea
        id={`policy-${name}`}
        value={policy}
        rows={2}
        onChange={(event) => {
          const updatedPolicy = event.target.value;

          setBrandPolicies((previous) => ({
            ...previous,
            [brand]: {
              ...previous[brand],
              [name]: updatedPolicy
            }
          }));
        }}
      />
    </div>
  ))}
</div>
</aside>
</div>
</section>
</main>
);
}
