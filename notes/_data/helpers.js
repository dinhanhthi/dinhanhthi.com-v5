module.exports = {
  currentYear() {
    const today = new Date();
    return today.getFullYear();
  },
  //
  convertDate(date, format = "upToDay") {
    const durationInDays =
      (new Date().getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    if (durationInDays < 1) {
      if (format === "upToDay") return "today";
      if (format === "upToMinutes") {
        const durationInHours = durationInDays * 24;
        if (durationInHours < 1) {
          const durationInMinutes = Math.round(durationInHours * 60);
          return `${durationInMinutes} minute${
            durationInMinutes > 1 ? "s" : ""
          } ago`;
        } else return `${Math.round(durationInHours)} hours ago`;
      }
    } else if (durationInDays < 2) {
      return "yesterday";
    } else if (durationInDays < 30) {
      return Math.round(durationInDays) + " days ago";
    } else if (durationInDays < 365) {
      const numMonths = Math.round(durationInDays / 30);
      return `${numMonths} month${numMonths > 1 ? "s" : ""} ago`;
    } else {
      const numYears = Math.round(durationInDays / 365);
      return `${numYears} year${numYears > 1 ? "s" : ""} ago`;
    }
  },
};
