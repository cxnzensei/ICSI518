package com.icsi518.backend.enums;

public enum TransactionCategory {
    // some categories are recurring transactions that could be assets or liabilities. keep them in the category list, eliminate them, or find better ways to show specific categories?
    GOALS,
    ASSETS,
    LIABILITIES,
    GROCERIES,
    DINING_AND_RESTAURANTS,
    UTILITIES, // liability?
    RENT_MORTGAGE, // liability?
    TRANSPORTATION,
    ENTERTAINMENT,
    HEALTHCARE,
    PERSONAL_CARE,
    SHOPPING,
    INSURANCE, // liablity too maybe?
    EDUCATION,
    SUBSCRIPTIONS, // could be liability?
    TRAVEL,
    INCOME, // could be asset?
    INVESTMENTS, // could also be asset
    GIFTS_AND_DONATIONS,
    MISCELLANEOUS
}
