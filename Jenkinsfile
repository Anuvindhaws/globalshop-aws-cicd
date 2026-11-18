
pipeline {
    agent any

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
    }
}
