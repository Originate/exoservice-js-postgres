Feature: Listing all {{modelName}}s

  Rules:
  - returns all {{modelName}}s currently stored


  Background:
    Given an ExoCom server
    And an instance of this service


  Scenario: no {{modelName}}s exist in the database
    When receiving the message "list {{modelName}}"
    Then the service replies with "{{modelName}} list" and the payload:
      """
      []
      """


  Scenario: {{modelName}}s exist in the database
    Given the service contains the {{modelName}}s:
      | NAME |
      | one  |
      | two  |
    When receiving the message "list {{modelName}}"
    Then the service replies with "{{modelName}} list" and the payload:
      """
      [
        {
          "createdAt": "<timestamp>",
          "id": "<uuid>",
          "name": "one",
          "updatedAt": "<timestamp>"
        },
        {
          "createdAt": "<timestamp>",
          "id": "<uuid>",
          "name": "two",
          "updatedAt": "<timestamp>"
        }
      ]
      """
