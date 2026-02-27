import java.util.Properties

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
  annotationProcessor(libs.micronaut.data.processor)
  annotationProcessor(libs.micronaut.validation.processor)
  annotationProcessor(libs.micronaut.openapi.processor)
  annotationProcessor(libs.logback.classic)
  
  implementation(libs.micronaut.serde.jackson)
  implementation(libs.micronaut.validation)
  implementation(libs.micronaut.data.jdbc)
  implementation(libs.micronaut.jdbc.hikari)
  implementation(libs.micronaut.flyway)
  implementation(libs.micronaut.management)
  implementation(libs.micronaut.tracing.opentelemetry.http)
  implementation(libs.opentelemetry.exporter.otlp)
  
  runtimeOnly(libs.duckdb.jdbc)
  runtimeOnly(libs.flyway.core)
  runtimeOnly(libs.flyway.database.duckdb)

  compileOnly(libs.micronaut.http.client)
  compileOnly(libs.micronaut.openapi.annotations)

  implementation(libs.logback.classic)

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

tasks.withType<JavaCompile> {
  options.compilerArgs.add("-Amicronaut.openapi.views.spec=redoc.enabled=true,redoc.theme=natural")
}

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
    replaceLogbackXml = false
  }
}

tasks.named<io.micronaut.gradle.docker.NativeImageDockerfile>("dockerfileNative") {
  jdkVersion = "21"
}

val frontendDir = file("${projectDir}/../frontend")

val buildFrontend = tasks.register<Exec>("buildFrontend") {
  group = "frontend"
  description = "Build the frontend application"
  workingDir = frontendDir
  
  // Inject context path into frontend build dynamically
  val props = Properties()
  val propsFile = file("src/main/resources/application.properties")
  if (propsFile.exists()) {
      props.load(propsFile.inputStream())
  }
  val contextPath = props.getProperty("micronaut.server.context-path", "")
  val cleanContextPath = if (contextPath == "/") "" else contextPath.removeSuffix("/")

  environment("VITE_BASE_URL", "$cleanContextPath/ui")
  environment("VITE_API_URL", "$cleanContextPath/api")
  
  commandLine("bun", "run", "build")
  inputs.dir(frontendDir.resolve("src"))
  inputs.file(frontendDir.resolve("package.json"))
  inputs.file(frontendDir.resolve("bun.lock"))
  outputs.dir(frontendDir.resolve(".output/public"))
}

val copyFrontendResources = tasks.register<Copy>("copyFrontendResources") {
  group = "frontend"
  description = "Copy the frontend resources to backends public dir"
  dependsOn(buildFrontend)
  from(frontendDir.resolve(".output/public"))
  into(layout.buildDirectory.dir("resources/main/public/ui")) // Put inside built resources nested at /ui
}

tasks.named("processResources") {
  finalizedBy(copyFrontendResources)
}

tasks.matching { it.name == "buildLayers" || it.name == "classes" || it.name == "shadowJar" }.configureEach {
  dependsOn(copyFrontendResources)
}

val testFrontend = tasks.register<Exec>("testFrontend") {
  group = "frontend"
  description = "Test the frontend application"
  workingDir = frontendDir
  commandLine("bun", "run", "test")
}

tasks.named("test") {
  dependsOn(testFrontend)
}

