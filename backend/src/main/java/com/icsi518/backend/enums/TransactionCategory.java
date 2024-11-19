package com.icsi518.backend.enums;

public enum TransactionCategory {
    // some categories are recurring transactions that could be assets or liabilities. keep them in the category list, eliminate them, or find better ways to show specific categories?
    GOALS,
    ASSETS,
    LIABILITIES,
    GROCERIES,
    RESTAURANTS,
    UTILITIES, // liability?
    RENT,
    MORTGAGE, // liability?
    TRANSPORTATION,
    ENTERTAINMENT,
    HEALTHCARE,
    PERSONALCARE,
    SHOPPING,
    INSURANCE, // liability too maybe?
    EDUCATION,
    SUBSCRIPTIONS, // could be liability?
    TRAVEL,
    INCOME, // could be asset?
    INVESTMENTS, // could also be asset
    MISCELLANEOUS
    // Asset/Liability UI needs to choose one of these cateofires (drop down), asset should automatically be credit etcs
}
