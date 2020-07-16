pipeline {
  agent {
    node {
      label 'nodejs'
    }

  }
  stages {
    stage('Preparation') {
      steps {
        sh 'git remote add prod https://github.com/studiowebux/webux-socket.git || true'
      }
    }

    stage('Dependencies') {
      steps {
        sh 'npm install'
      }
    }

    stage('Documentation') {
      steps {
        sh 'npm run-script doc'
      }
    }

    stage('Lint') {
      steps {
        sh 'npm run-script lint'
      }
    }

    stage('Test') {
      steps {
        sh 'npm run test'
      }
    }

    stage('Versionning') {
      steps {
        script {
          env.RELEASE_SCOPE = input message: 'User input required', ok: 'Continue',
                            parameters: [choice(name: 'RELEASE_SCOPE', choices: 'patch\nminor\nmajor', description: 'What is the release scope?')]
        }
        echo "${env.RELEASE_SCOPE}"
      }
    }

    stage('Staging') {
      steps {
        sh 'git push prod master'
        sh 'git push origin master'
        sh "npm version ${env.RELEASE_SCOPE}"
        sh 'npm publish --registry=https://npm.webux.lab'
        input 'Deploy to production ?'
      }
    }

    stage('Production') {
      steps {
        sh 'git push prod master'
        sh 'git push origin master'
        sh 'npm publish --access public'
        mail(subject: 'Webux-socket - Published', body: 'Webux-socket has been published to production')
      }
    }

  }
  post {
    failure {
        mail to: 'tommy@studiowebux.com',
        subject: "Failed Pipeline ${currentBuild.fullDisplayName}",
        body: " For details about the failure, see ${env.BUILD_URL}"
    }
  }
}