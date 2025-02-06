import { Grid, TextField, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers';

const categories = [
  'All',
  'Food',
  'Transportation',
  'Housing',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Others'
];

const ExpenseFilter = ({ filters, onFilterChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            select
            label="Category"
            value={filters.category}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={(newDate) => onFilterChange('startDate', newDate)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(newDate) => onFilterChange('endDate', newDate)}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default ExpenseFilter;
