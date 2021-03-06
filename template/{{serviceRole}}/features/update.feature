Feature: Updating a {{modelName}}

  Rules:
  - when receiving "update {{modelName}}",
    updates the {{modelName}} record with the given id
    and returns "{{modelName}} updated" with the new record


  Background:
    Given an ExoCom server
    And an instance of this service
    And the service contains the {{modelName}}s:
      | NAME |
      | one  |
      | two  |


  Scenario: updating an existing {{modelName}}
    When receiving the message "update {{modelName}}" with the payload:
      """
      {
        "id": "<uuid of one>",
        "name": "number one"
      }
      """
    Then the service replies with "{{modelName}} updated" and the payload:
      """
      {
        "createdAt": "<timestamp>",
        "id": "<uuid>",
        "name": "number one",
        "updatedAt": "<timestamp>"
      }
      """
    And the service now contains the {{modelName}}s:
      | NAME       |
      | number one |
      | two        |


  Scenario: trying to update a non-existing {{modelName}}
    When receiving the message "update {{modelName}}" with the payload:
      """
      {
        "id": "zero",
        "name": "a total zero"
      }
      """
    Then the service replies with "{{modelName}} not-found"
    And the service now contains the {{modelName}}s:
      | NAME |
      | one  |
      | two  |
