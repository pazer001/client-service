export function getShares(
  portfolioValue: number,
  stopLoss: number,
  riskCapitalPercent: number = 0.02,
  closeValue: number = 100_000,
): number {
  const maxPositionSizeDivider = 4.0;

  // Input validation
  if (
    portfolioValue <= 0 ||
    riskCapitalPercent <= 0 ||
    closeValue <= 0 ||
    stopLoss < 0
  ) {
    return 0;
  }

  // Calculate risk capital
  const riskCapital = portfolioValue * riskCapitalPercent;

  // Calculate max buy amount (e.g., 25% of portfolio if divider = 4)
  const maxBuyAmount = portfolioValue / maxPositionSizeDivider;

  // Calculate stop-loss difference
  const stopLossDifference = Math.abs(closeValue - stopLoss);
  if (stopLossDifference === 0) {
    return 0;
  }

  // Calculate shares based on risk
  let shares = riskCapital / stopLossDifference;

  // Check total cost against max buy amount
  const amount = shares * closeValue;
  if (amount > maxBuyAmount) {
    shares = maxBuyAmount / closeValue;
  }

  // Return floored integer shares
  return Math.floor(shares);
}

export function formatNumber(value: number, fractionDigits: number = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
}
