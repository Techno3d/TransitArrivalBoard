fn main() -> Result<(), std::io::Error> {
  prost_build::compile_protos(&["proto/gtfs-realtime.proto"], &["proto"])?;
  Ok(())
}
