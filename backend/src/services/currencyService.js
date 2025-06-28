const fs = require('fs');
const path = require('path');

class CurrencyService {
  constructor() {
    this.rates = this.loadExchangeRates();
  }

  loadExchangeRates() {
    try {
      const ratesPath = path.join(__dirname, '../../data/exchangeRates.json');
      const data = fs.readFileSync(ratesPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading exchange rates:', error);
      // Fallback rates if file not found
      return {
        USD: 1,
        EUR: 0.85,
        PKR: 280
      };
    }
  }

  convert(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    
    // Convert to USD first (base currency)
    const amountInUSD = amount / this.rates[fromCurrency];
    
    // Convert from USD to target currency
    return amountInUSD * this.rates[toCurrency];
  }

  getSupportedCurrencies() {
    return Object.keys(this.rates);
  }
}

module.exports = new CurrencyService();