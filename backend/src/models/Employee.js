const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  dept: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'resigned'],
    default: 'active'
  },
  hourlyRate: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      default: 'USD'
    }
  },
  hireDate: {
    type: Date,
    required: true
  },
  raises: [{
    date: {
      type: Date,
      default: Date.now
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      required: true,
      uppercase: true
    }
  }],
  holidays: [{
    date: {
      type: Date,
      required: true
    },
    kind: {
      type: String,
      enum: ['paid', 'unpaid', 'sick'],
      required: true
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);