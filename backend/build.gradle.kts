plugins {
  alias(libs.plugins.micronaut.application)
  alias(libs.plugins.shadow)
  alias(libs.plugins.micronaut.aot)
}

version = "0.0.1"
group = "com.example.todo"

repositories {
  mavenCentral()
}

dependencies {
  annotationProcessor(libs.micronaut.http.validation)
  annotationProcessor(libs.micronaut.serde.processor)

  implementation(libs.micronaut.serde.jackson)

  compileOnly(libs.micronaut.http.client)

  runtimeOnly(libs.logback.classic)

  testImplementation(libs.micronaut.http.client)

  testRuntimeOnly(libs.junit.platform.launcher)
}

application {
  mainClass = "com.example.todo.Main"
}

java {
  sourceCompatibility = JavaVersion.toVersion("21")
  targetCompatibility = JavaVersion.toVersion("21")
}

graalvmNative.toolchainDetection = false

micronaut {
  runtime("netty")
  testRuntime("junit5")
  processing {
    incremental(true)
    annotations("com.example.todo.*")
  }
  aot {
    // Please review carefully the optimizations enabled below
    // Check https://micronaut-projects.github.io/micronaut-aot/latest/guide/ for more details
    optimizeServiceLoading = false
    convertYamlToJava = false
    precomputeOperations = true
    cacheEnvironment = true
    optimizeClassLoading = true
    deduceEnvironment = true
    optimizeNetty = true
    replaceLogbackXml = true
  }
}

tasks.named<io.micronaut.gradle.docker.NativeImageDockerfile>("dockerfileNative") {
  jdkVersion = "21"
}

