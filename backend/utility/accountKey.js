const express = require("express");
const { models } = require("mongoose");

const fireBase_key = {
  type: "service_account",
  project_id: "khelmela-98",
  private_key_id: "49c87cef5edc71bb95f7da94bd8a7611bd16fc8c",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCWikogVpvN2nIA\nyKU3+VMZRvZsf9aTQuBxsdN8A3wA3N8S5SiHtUMtKLmSJH/ntn0T5IgfvT4lhxQ6\nNIcwhSCcQfAJ3tyABvcQYRlnTYk5dAuWrXxAKH/Tj+1rk9zkH4mnQ2VZwypCmTIg\nk/SXilP4TLTNSI/iDwHx7PRDMP96WoRXx3ovtqFqe4fVLMMWdxGTkdhpiBZbNVCq\nMSk+opQd7F9E8Mi4D45Bsxfm3X7+v1Trl2TMtZVYmgD2FTTXxSz4zHgkRydKYKJh\ndQxsx3FOlcO3ScNthqaiODJ9Ehz7KqqfrpVhmeibVwTtTY4+OSOAiIHX6K80dSaD\n5N7Oro6LAgMBAAECggEAPVxG1KGYxjKJD2q5dXRJ+96h6R2+f63dwFoEYuMks1FU\nF+aSO6aVqB2Wbkw0WmVW3DnlhlJjt3Y0t3jbtdo9rZNu3QcbB5BPOjzp1uKS0XlM\nk/FI2PnpCHn9A0F04wM735KoCAt1+UlqVj8YjoBSs73IYHh4NWN6nnrAIXciW2NT\nvaugo9Z+TRjOL0TBn00oVhDvgxJDTHdYg29IE9l7pAO8GL5MnZe5+OJ6cenjgFqP\n9CjfRzq68AHhTAtxlcoQ6aKSD8Oua0smEiMnfcoNUZ4mqrFqZQSLeBYPIkuSi5A/\nheEhFvmr0BhegQ41e/Nolv8ZCCiin3Exxb82z0FTkQKBgQDKG0t+bFBy/ZMutpFY\njP+WE5nH50tSK+XMfiRYysKZESlJwP5CZ52t8rByalahzNGLhH8iClwGvO2Gag3y\nWr3CWXnQcdE2XdEnTNZO7/Q1nrEwiof5eE7Jzu3F8nSN/MAu8PF3U44q9H6MWn86\nb+uxvX7Xsmtv9FEtKZOM/0MYSQKBgQC+rtbBA0y1HR2Zn9bQluoOCWa1Urc4BXaq\nGuXX7SgK8aDD128HMTC0OpzW4BDcPAAWhchGIazh93IVnaoJVMDlPoHbILNPpWiC\n6r+OoCTmwzpBxAn4R5ZyEgSsnMJyR+JGL+WZBwOT7ZaPgJmwwNRQtHvPxx2ZBtCO\n+mrOUnr4MwKBgQCv0RbXn/pMTnOfi4rdcatWLy70TC2mCjIatxF/fMPUzK0SUCXg\nNqthC2Kb5g3/K2KO8HB4eHKeGfS3ncMMNgwl6hiiUKEjnnG4sossmGnly2txQtIP\nH63KuYz3SnhCnMHDFC+7EqD2lUMRbhiICZ0MPkD9+2SjO/LyStzlJ5qCoQKBgQCQ\nTUf/8TtPpKUN6URrvomJ7dtoRRyarKfMu2ZNLhArmAgNrS88xiERg3nFsvOPd2ip\noryZNkrbBqOzcAmJ3jXMRq2G4wxPreGVkYk9qjvC1uNzeaQB3EsiMDiRWGBek7/N\nVdnvILu4awiRuMSWWpdSLAO2jfz8HYgfa6sAULL2uQKBgQCpa3eLGMqtWSfV228d\n/7Wgnmqxd+ZwVTxXUPWkJgMm8VhApCFGoAzIeQW/tCdo5aJmo+QztbxCZg4+aW9b\nGb8Yd45nx0PncatcW24l1e2TmyfQWuQJs44tDlrEj15MBJoXYrPJyM/fmeD0tBgJ\nRV4tk2iWs2uQWuBYU9WKRf6BXA==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@khelmela-98.iam.gserviceaccount.com",
  client_id: "107129429150763388758",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40khelmela-98.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

module.exports = fireBase_key;
