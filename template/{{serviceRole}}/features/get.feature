Feature: Get details for a {{modelName}}

  Rules:
  - when receiving "get {{modelName}}",
    returns "{{modelName}} details" with details for the given {{modelName}}


  Background:
    Given an ExoCom server
    And an instance of this service
    And the service contains the {{modelName}}s:
      | NAME |
      | one  |
      | two  |


  Scenario: locating an existing {{modelName}} by id
    When receiving the message "get {{modelName}}" with the payload:
      """
      {
        "id": "<uuid of one>"
      }
      """
    Then the service replies with "{{modelName}} details" and the payload:
      """
      {
        "createdAt": "<timestamp>",
        "id": "<uuid>",
        "name": "one",
        "updatedAt": "<timestamp>"
      }
      """


  Scenario: locating a non-existing {{modelName}} by id
    When receiving the message "get {{modelName}}" with the payload:
      """
      {
        "id": "zonk"
      }
      """
    Then the service replies with "{{modelName}} not-found"
