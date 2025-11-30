import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const getEmployeeDashboard = createAsyncThunk(
  'dashboard/getEmployeeDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/employee');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get dashboard');
    }
  }
);

export const getManagerDashboard = createAsyncThunk(
  'dashboard/getManagerDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/dashboard/manager');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get dashboard');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    employeeData: null,
    managerData: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getEmployeeDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getEmployeeDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.employeeData = action.payload;
      })
      .addCase(getEmployeeDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getManagerDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getManagerDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.managerData = action.payload;
      })
      .addCase(getManagerDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = dashboardSlice.actions;
export default dashboardSlice.reducer;


