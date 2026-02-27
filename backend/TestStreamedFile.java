import io.micronaut.http.server.types.files.StreamedFile;
import java.net.URL;

public class TestStreamedFile {
    public static void main(String[] args) throws Exception {
        URL url = new URL("file:///dev/null");
        StreamedFile sf = new StreamedFile(url);
    }
}
