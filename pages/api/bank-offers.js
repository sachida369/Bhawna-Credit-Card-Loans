export default async function handler(req, res) {
  const limit = Number(req.query.limit || 10);

  // TODO: replace with your aggregator/provider fetches.
  // Example shape expected by the frontend table:
  // [{ bank, product, apr, maxAmt, minSalary, joiningFee }]

  // TEMP: pull from your DB or CMS; here is a passthrough of the fallback as a stub
  const sample = [
    { bank: "HDFC Bank", product: "Personal Loan", apr: 10.5, maxAmt: 4000000, minSalary: 25000 },
    { bank: "ICICI Bank", product: "Personal Loan", apr: 10.99, maxAmt: 3500000, minSalary: 25000 },
    { bank: "SBI", product: "Home Loan", apr: 8.5, maxAmt: 8000000, minSalary: 20000 },
    { bank: "Axis Bank", product: "Credit Card", apr: 42.0, maxAmt: 0, minSalary: 15000, joiningFee: 499 },
    { bank: "Kotak", product: "Credit Card", apr: 41.88, maxAmt: 0, minSalary: 15000, joiningFee: 0 },
    { bank: "IDFC FIRST", product: "Personal Loan", apr: 10.75, maxAmt: 3000000, minSalary: 20000 },
    { bank: "Yes Bank", product: "Credit Card", apr: 42.0, maxAmt: 0, minSalary: 15000, joiningFee: 0 },
    { bank: "IndusInd", product: "Personal Loan", apr: 11.0, maxAmt: 3000000, minSalary: 25000 },
    { bank: "PNB", product: "Home Loan", apr: 8.6, maxAmt: 7000000, minSalary: 20000 },
    { bank: "BOB", product: "Car Loan", apr: 9.25, maxAmt: 3000000, minSalary: 15000 },
  ];

  res.status(200).json(sample.slice(0, limit));
}
