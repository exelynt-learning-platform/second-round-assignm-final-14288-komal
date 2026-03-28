// Mock the apiConfig module to avoid import.meta issues in Jest
jest.mock("../config/apiConfig", () => ({
  getApiKey: () => "test-api-key",
  OPENAI_API_URL: "https://api.openai.com/v1/chat/completions",
  OPENAI_MODEL: "gpt-3.5-turbo",
}));

import chatReducer, {
  addUserMessage,
  clearError,
  sendMessage,
} from "../redux/features/chatSlice";


describe("chatSlice", () => {
  const initialState = {
    messages: [],
    loading: false,
    error: null,
  };

  test("should return the initial state", () => {
    expect(chatReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  test("should add a user message to the messages array", () => {
    const nextState = chatReducer(initialState, addUserMessage("Hello AI!"));
    expect(nextState.messages).toHaveLength(1);
    expect(nextState.messages[0]).toEqual({ role: "user", text: "Hello AI!" });
  });

  test("should append multiple user messages in order", () => {
    let state = chatReducer(initialState, addUserMessage("First message"));
    state = chatReducer(state, addUserMessage("Second message"));
    expect(state.messages).toHaveLength(2);
    expect(state.messages[0].text).toBe("First message");
    expect(state.messages[1].text).toBe("Second message");
  });

  test("should clear the error state", () => {
    const errorState = { ...initialState, error: "Some error occurred" };
    const nextState = chatReducer(errorState, clearError());
    expect(nextState.error).toBeNull();
  });

 
  test("should set loading to true when sendMessage is pending", () => {
    const nextState = chatReducer(initialState, sendMessage.pending("reqId"));
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test("should clear previous error when sendMessage is pending", () => {
    const errorState = { ...initialState, error: "Previous error" };
    const nextState = chatReducer(errorState, sendMessage.pending("reqId"));
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  test("should add AI response and stop loading when sendMessage is fulfilled", () => {
    const loadingState = { ...initialState, loading: true };
    const nextState = chatReducer(
      loadingState,
      sendMessage.fulfilled("AI response here", "reqId", "user input")
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.messages).toHaveLength(1);
    expect(nextState.messages[0]).toEqual({
      role: "ai",
      text: "AI response here",
    });
  });


  test("should set error and stop loading when sendMessage is rejected", () => {
    const loadingState = { ...initialState, loading: true };
    const nextState = chatReducer(
      loadingState,
      sendMessage.rejected(null, "reqId", "user input", "Network error")
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe("Network error");
  });

  
  test("should handle a full conversation flow correctly", () => {
    let state = initialState;

  
    state = chatReducer(state, addUserMessage("What is React?"));
    expect(state.messages).toHaveLength(1);

   
    state = chatReducer(state, sendMessage.pending("reqId"));
    expect(state.loading).toBe(true);

  
    state = chatReducer(
      state,
      sendMessage.fulfilled(
        "React is a JavaScript library for building UIs.",
        "reqId",
        "What is React?"
      )
    );
    expect(state.loading).toBe(false);
    expect(state.messages).toHaveLength(2);
    expect(state.messages[0].role).toBe("user");
    expect(state.messages[1].role).toBe("ai");
  });
});
