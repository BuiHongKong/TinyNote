resource "aws_apprunner_service" "tinynote" {
  service_name = "tinynote"

  source_configuration {
    image_repository {
      image_identifier      = "${aws_ecr_repository.tinynote.repository_url}:latest"
      image_repository_type = "ECR"

      image_configuration {
        port = "3000"

        runtime_environment_variables = {
          TABLE_NAME = aws_dynamodb_table.notes.name
          AWS_REGION = "ap-southeast-1"
        }
      }
    }

    authentication_configuration {
      access_role_arn = aws_iam_role.apprunner.arn
    }

    auto_deployments_enabled = true
  }
}
