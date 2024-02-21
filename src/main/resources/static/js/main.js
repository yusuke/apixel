function callHighlightApi(x, y, color) {
    fetch(`/api/highlight?x=${x}&y=${y}&color=${color}`, {method: 'POST'});
}

document.addEventListener('DOMContentLoaded', function () {
    const table = document.getElementById('table');
    let isDragging = false;
    const colors = ["red", "blue", "green", "purple"];
    const color = colors[Math.floor(Math.random() * colors.length)];

    for (let y = 0; y < 16; y++) {
        const row = table.insertRow();
        for (let x = 0; x < 16; x++) {
            const cell = row.insertCell();
            cell.classList.add('cell');
            cell.dataset.x = String(x);
            cell.dataset.y = String(y);

            cell.addEventListener('mousedown', function () {
                isDragging = true;
                callHighlightApi(this.dataset.x, this.dataset.y, color);
            });

            cell.addEventListener('mousemove', function () {
                if (isDragging) {
                    callHighlightApi(this.dataset.x, this.dataset.y, color);
                }
            });

            cell.addEventListener('touchstart', function (event) {
                event.preventDefault();
                isDragging = true;
                callHighlightApi(this.dataset.x, this.dataset.y, color);
            }, {passive: false});

            const firstCell = document.querySelector('.cell');
            const cellWidth = firstCell.offsetWidth;
            const cellHeight = firstCell.offsetHeight;

            cell.addEventListener('touchmove', function (event) {
                event.preventDefault();
                if (isDragging) {
                    const touch = event.changedTouches[0];
                    // Get the information for finger #0 
                    const x = Math.floor(touch.pageX / cellWidth);
                    const y = Math.floor(touch.pageY / cellHeight);
                    callHighlightApi(x, y, color);
                }
            }, {passive: false});
        }
    }
    document.addEventListener('mouseup', function () {
        isDragging = false;
    });
    document.addEventListener('touchend', function () {
        isDragging = false;
    });
    function highlightCell(x, y, color) {
        const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
        if (cell) {
            cell.style.backgroundColor = color;
            setTimeout(() => {
                cell.style.backgroundColor = 'white';
            }, 1000);
        }
    }
    const stompEndpoint = new URL("./api", window.location.href).href;
    const socket = new SockJS(stompEndpoint);
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        console.log('Connected: ' + frame);
        stompClient.subscribe('/topic/highlight', function (message) {
            const payload = JSON.parse(message.body);
            highlightCell(payload.x, payload.y, payload.color);
        });
    });
});
const apiEndpoint = new URL("./api/highlight", window.location.href).href;
document.getElementById("endpoint").value = apiEndpoint;
document.getElementById("curl").value = `curl "${apiEndpoint}?x=1&y=2&color=red"`;
document.getElementById("java").value = `import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

class Main {
    public static void main(String[] args) throws IOException, InterruptedException, URISyntaxException {
        try (HttpClient client = HttpClient.newHttpClient()) {
            for (int i = 0; i < 16; i++) {
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(new URI("${apiEndpoint}?x=%s&y=0&color=red".formatted(i)))
                        .POST(HttpRequest.BodyPublishers.ofString(""))
                        .build();
                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            }
        }
    }
}`;