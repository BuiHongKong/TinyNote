resource "aws_dynamodb_table" "notes" {
  name         = "tinynote-notes"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}
