package one.cafebabe.pixel;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;

class PixelsTest {
    @Test
    void newPixels() {
        Pixels pixels = new Pixels(9, 9);
        assertEquals(9, pixels.width());
        assertEquals(9, pixels.height());
        

    }

}