import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CompetitionState {
  id?: string;
}

const initialState: CompetitionState = {
  id: undefined,
};

const competitionSlice = createSlice({
  name: 'competition',
  initialState,
  reducers: {
    setCurrentCompId: (state, action: PayloadAction<string>) => {
      state.id = action.payload;
    },
    clearCurrentCompId: (state) => {
      state.id = undefined;
    },
  },
});

export const { setCurrentCompId, clearCurrentCompId } = competitionSlice.actions;
export default competitionSlice;
