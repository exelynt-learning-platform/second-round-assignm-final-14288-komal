import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getApiKey, OPENAI_API_URL, OPENAI_MODEL } from "../../config/apiConfig";


export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async (message, { rejectWithValue }) => {
    try {
      const apiKey = getApiKey();

      if (!apiKey || apiKey === "your_openai_api_key_here") {
        return rejectWithValue(
          "API key is not configured. Please add your OpenAI API key to the .env file."
        );
      }

      const response = await axios.post(
        OPENAI_API_URL,
        {
          model: OPENAI_MODEL,
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
    if (error.response) {
        const status = error.response.status;
        const errorMessage = error.response.data?.error?.message;

        if (status === 401) {
          return rejectWithValue(
            "Invalid API key. Please check your OpenAI API key in the .env file."
          );
        }
        if (status === 429) {
          return rejectWithValue(
            "Rate limit exceeded. Please wait a moment and try again."
          );
        }
        if (status === 500 || status === 503) {
          return rejectWithValue(
            "OpenAI server error. Please try again later."
          );
        }
        return rejectWithValue(errorMessage || "API request failed.");
      }

      if (error.request) {
        return rejectWithValue(
          "Network error. Please check your internet connection and try again."
        );
      }

      return rejectWithValue("An unexpected error occurred. Please try again.");
    }
  }
);


const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({ role: "user", text: action.payload });
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push({ role: "ai", text: action.payload });
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { addUserMessage, clearError } = chatSlice.actions;
export default chatSlice.reducer;
