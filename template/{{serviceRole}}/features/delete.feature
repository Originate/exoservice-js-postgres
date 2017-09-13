Feature: Deleting a {{modelName}}

  Rules:
  - when receiving "delete {{modelName}}",
    removes the {{modelName}} record with the given id
    and returns "{{modelName}} deleted"


  Background:
    Given an ExoCom server
    And an instance of this service
    And the service contains the {{modelName}}s:
      | NAME |
      | one  |
      | two  |


  Scenario: deleting an existing {{modelName}}
    When receiving the message "delete {{modelName}}" with the payload:
      """
      { "id": "<uuid of one>" }
      """
    Then the service replies with "{{modelName}} deleted" and the payload:
      """
      {
        "createdAt": "<timestamp>",
        "id": "<uuid>",
        "name": "one",
        "updatedAt": "<timestamp>"
      }
      """
    And the service now contains the {{modelName}}s:
      | NAME |
      | two  |


  Scenario: trying to delete a non-existing {{modelName}}
    When receiving the message "delete {{modelName}}" with the payload:
      """
      { "id": "zonk" }
      """
    Then the service replies with "{{modelName}} not-found"
    And the service now contains the {{modelName}}s:
      | NAME |
      | one  |
      | two  |
