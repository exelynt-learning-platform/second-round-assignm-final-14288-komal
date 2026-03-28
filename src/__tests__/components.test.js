jest.mock("../config/apiConfig", () => ({
  getApiKey: () => "test-api-key",
  OPENAI_API_URL: "https://api.openai.com/v1/chat/completions",
  OPENAI_MODEL: "gpt-3.5-turbo",
}));

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "../redux/features/chatSlice";
import ChatBox from "../components/ChatBox";
import Message from "../components/Message";
import Loader from "../components/Loader";
import InputBox from "../components/Inbox";


const renderWithStore = (component, preloadedState = {}) => {
  const store = configureStore({
    reducer: { chat: chatReducer },
    preloadedState: {
      chat: { messages: [], loading: false, error: null, ...preloadedState },
    },
  });
  return render(<Provider store={store}>{component}</Provider>);
};


describe("Message component", () => {
  test("renders user message with correct text", () => {
    render(<Message msg={{ role: "user", text: "Hello!" }} />);
    expect(screen.getByText("Hello!")).toBeInTheDocument();
  });

  test("renders AI message with correct text", () => {
    render(<Message msg={{ role: "ai", text: "Hi there!" }} />);
    expect(screen.getByText("Hi there!")).toBeInTheDocument();
  });

  test("applies blue styling for user messages", () => {
    render(<Message msg={{ role: "user", text: "Test" }} />);
    const messageEl = screen.getByText("Test");
    expect(messageEl.className).toContain("bg-blue-500");
  });

  test("applies gray styling for AI messages", () => {
    render(<Message msg={{ role: "ai", text: "Test" }} />);
    const messageEl = screen.getByText("Test");
    expect(messageEl.className).toContain("bg-gray-300");
  });
});


describe("Loader component", () => {
  test("renders loading text", () => {
    render(<Loader />);
    expect(screen.getByText("AI is typing...")).toBeInTheDocument();
  });

  test("renders spinner SVG element", () => {
    const { container } = render(<Loader />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});


describe("ChatBox component", () => {
  test("shows empty state message when no messages exist", () => {
    renderWithStore(<ChatBox />);
    expect(
      screen.getByText("Start a conversation by typing a message below.")
    ).toBeInTheDocument();
  });

  test("renders messages from the store", () => {
    renderWithStore(<ChatBox />, {
      messages: [
        { role: "user", text: "Hello" },
        { role: "ai", text: "Hi!" },
      ],
    });
    expect(screen.getByText("Hello")).toBeInTheDocument();
    expect(screen.getByText("Hi!")).toBeInTheDocument();
  });

  test("shows loader when loading is true", () => {
    renderWithStore(<ChatBox />, { loading: true });
    expect(screen.getByText("AI is typing...")).toBeInTheDocument();
  });

  test("displays error message when error exists", () => {
    renderWithStore(<ChatBox />, { error: "API key is invalid" });
    expect(screen.getByText("API key is invalid")).toBeInTheDocument();
  });
});


describe("InputBox component", () => {
  test("renders input field and send button", () => {
    renderWithStore(<InputBox />);
    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeInTheDocument();
    expect(screen.getByText("Send")).toBeInTheDocument();
  });

  test("send button is disabled when input is empty", () => {
    renderWithStore(<InputBox />);
    expect(screen.getByText("Send")).toBeDisabled();
  });

  test("send button is enabled when input has text", () => {
    renderWithStore(<InputBox />);
    fireEvent.change(screen.getByPlaceholderText("Type your message..."), {
      target: { value: "Hello" },
    });
    expect(screen.getByText("Send")).not.toBeDisabled();
  });

  test("clears input after sending a message", () => {
    renderWithStore(<InputBox />);
    const input = screen.getByPlaceholderText("Type your message...");
    fireEvent.change(input, { target: { value: "Hello" } });
    fireEvent.click(screen.getByText("Send"));
    expect(input.value).toBe("");
  });

  test("input is disabled while loading", () => {
    renderWithStore(<InputBox />, { loading: true });
    expect(
      screen.getByPlaceholderText("Type your message...")
    ).toBeDisabled();
  });
});
