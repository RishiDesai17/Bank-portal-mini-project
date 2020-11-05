CREATE DATABASE IF NOT EXISTS bank;

CREATE TABLE IF NOT EXISTS Bank (
    Bank_code INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Branch (
    Branch_id INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(25) NOT NULL,
    Address VARCHAR(250) NOT NULL,
    Bank INTEGER UNSIGNED NOT NULL,
    CONSTRAINT Constr_Bank_Branch_fk
        FOREIGN KEY Bank_fk (Bank) REFERENCES Bank (Bank_code)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Customer (
    Customer_id INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(20) NOT NULL,
    Name VARCHAR(15) NOT NULL,
    Password TEXT NOT NULL,
    Address VARCHAR(250) NOT NULL,
    UNIQUE(Username)
);

CREATE TABLE IF NOT EXISTS CustomerPhones (
    Customer INTEGER UNSIGNED NOT NULL,
    Phone VARCHAR(10) NOT NULL,
    CONSTRAINT Constr_Customer_fk
        FOREIGN KEY Customer_fk (Customer) REFERENCES Customer (Customer_id) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Account (
    Account_no INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Balance INTEGER NOT NULL,
    Branch INTEGER UNSIGNED NOT NULL,
    CONSTRAINT Constr_Branch_Account_fk
        FOREIGN KEY Branch_fk (Branch) REFERENCES Branch (Branch_id) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS CurrentAcc (
    Account INTEGER UNSIGNED NOT NULL ,
    Initial_amount INTEGER UNSIGNED NOT NULL,
    CONSTRAINT Current_Account
        FOREIGN KEY Account_fk (Account) REFERENCES Account (Account_no) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS SavingAcc (
    Account INTEGER UNSIGNED NOT NULL,
    Interest INTEGER UNSIGNED NOT NULL,
    CONSTRAINT Saving_Account
        FOREIGN KEY Account_fk (Account) REFERENCES Account (Account_no) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Customer_Account (
    Customer INTEGER UNSIGNED NOT NULL,
    Account INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Customer, Account),
    CONSTRAINT Constr_CustomerAccount_Customer_fk
        FOREIGN KEY Customer_fk (Customer) REFERENCES Customer (Customer_id)
        ON DELETE CASCADE,
    CONSTRAINT Constr_CustomerAccount_Account_fk
        FOREIGN KEY Account_fk (Account) REFERENCES Account (Account_no)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Loan (
    Loan_no INTEGER UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    Type VARCHAR(15) NOT NULL,
    Interest INTEGER NOT NULL,
    Address VARCHAR(250) NOT NULL,
    Branch INTEGER UNSIGNED NOT NULL,
    CONSTRAINT Constr_Branch_Loan_fk
        FOREIGN KEY Branch_fk (Branch) REFERENCES Branch (Branch_id) 
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Customer_Loan (
    Customer INTEGER UNSIGNED NOT NULL,
    Loan INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Customer, Loan),
    CONSTRAINT Constr_CustomerLoan_Customer_fk
        FOREIGN KEY Customer_fk (Customer) REFERENCES Customer (Customer_id)
        ON DELETE CASCADE,
    CONSTRAINT Constr_CustomerLoan_Loan_fk
        FOREIGN KEY Loan_fk (Loan) REFERENCES Loan (Loan_no)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Transaction (
    Transaction_id INTEGER UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Type VARCHAR(15) NOT NULL,
    Amount INTEGER NOT NULL,
    Timestamp DATETIME NOT NULL,
    AccountFrom INTEGER UNSIGNED NOT NULL,
    AccountTo INTEGER UNSIGNED NOT NULL,
    CONSTRAINT Constr_AccountTransactions_Account_fk
        FOREIGN KEY AccountFrom_fk (AccountFrom) REFERENCES Account (Account_no)
        ON DELETE CASCADE
    CONSTRAINT Constr_AccountTransactions_Account_fk
        FOREIGN KEY AccountTo_fk (AccountTo) REFERENCES Account (Account_no)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Staff (
    Staff_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    Salary INTEGER NOT NULL,
    Post VARCHAR(25) NOT NULL,
    Name VARCHAR(50) NOT NULL,
    Password VARCHAR(50) NOT NULL,
    Address VARCHAR(250) NOT NULL,
    Bank INTEGER UNSIGNED NOT NULL,
    CONSTRAINT Constr_BankStaff_Bank_fk
        FOREIGN KEY Bank_fk (Bank) REFERENCES Bank (Bank_code)
        ON DELETE CASCADE
);

-- CREATE TRIGGER 
-- BEFORE INSERT
-- ON Transaction FOR EACH ROW
-- BEGIN
    