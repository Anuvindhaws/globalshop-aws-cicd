
pipeline {
    agent any

    environment {
        AWS_DEFAULT_REGION = 'ap-south-1'
        S3_BUCKET = 'globalshop-255291984550-ap-south-1'
        CLOUDFRONT_DISTRIBUTION_ID = 'E2FR36CBERQ4VV'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'GlobalShop source code checked out from GitHub'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm.cmd ci --prefix frontend'
            }
        }

        stage('Build React Application') {
            steps {
                bat 'npm.cmd run build --prefix frontend'
            }
        }

        stage('Verify Build') {
            steps {
                bat 'if not exist frontend\\dist\\index.html exit /b 1'
                echo 'React production build completed successfully'
            }
        }

        stage('Check AWS CLI') {
            steps {
                bat 'aws --version'
            }
        }

        stage('Deploy to S3') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    bat '''
                        aws sts get-caller-identity
                        aws s3 sync frontend\\dist s3://%S3_BUCKET% --delete
                    '''
                }
            }
        }

        stage('CloudFront Invalidation') {
            steps {
                withCredentials([
                    string(credentialsId: 'aws-access-key', variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-key', variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    bat '''
                        aws cloudfront create-invalidation --distribution-id %CLOUDFRONT_DISTRIBUTION_ID% --paths "/*"
                    '''
                }
            }
        }
    }
}
