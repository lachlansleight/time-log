class TextUtils {
    public static getHourString(hour: number, withMinutes = true) {
        let minutes = ((hour % 1) * 60).toString();
        while (minutes.length < 2) minutes = "0" + minutes;
        let hours = Math.floor(hour) % 12;
        if (hours <= 0) hours = 12;
        const ampm = Math.floor(hour) < 12 || Math.floor(hour) === 24 ? "am" : "pm";
        return hours + (withMinutes ? ":" + minutes : "") + ampm;
    }
}

export default TextUtils;
