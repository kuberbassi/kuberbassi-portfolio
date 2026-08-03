import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const OWNER_TIME_ZONE = 'Asia/Kolkata';
const OWNER_LATITUDE = 28.6139;
const OWNER_LONGITUDE = 77.209;
const SOLAR_ZENITH = 90.833;

type TimePeriod = 'day' | 'night';

const toRadians = (degrees: number) => degrees * (Math.PI / 180);
const toDegrees = (radians: number) => radians * (180 / Math.PI);
const normalizeDegrees = (degrees: number) => ((degrees % 360) + 360) % 360;
const normalizeHours = (hours: number) => ((hours % 24) + 24) % 24;

function getDayOfYear(year: number, month: number, day: number) {
  const start = Date.UTC(year, 0, 0);
  const current = Date.UTC(year, month - 1, day);
  return Math.floor((current - start) / 86_400_000);
}

// NOAA sunrise/sunset approximation using the standard -0.833° horizon.
function getSolarEventUtc(
  year: number,
  month: number,
  day: number,
  sunrise: boolean,
) {
  const dayOfYear = getDayOfYear(year, month, day);
  const longitudeHour = OWNER_LONGITUDE / 15;
  const approximateTime =
    dayOfYear + ((sunrise ? 6 : 18) - longitudeHour) / 24;
  const meanAnomaly = 0.9856 * approximateTime - 3.289;
  const trueLongitude = normalizeDegrees(
    meanAnomaly
      + 1.916 * Math.sin(toRadians(meanAnomaly))
      + 0.02 * Math.sin(toRadians(2 * meanAnomaly))
      + 282.634,
  );

  let rightAscension = normalizeDegrees(
    toDegrees(Math.atan(0.91764 * Math.tan(toRadians(trueLongitude)))),
  );
  rightAscension +=
    Math.floor(trueLongitude / 90) * 90 - Math.floor(rightAscension / 90) * 90;
  rightAscension /= 15;

  const sinDeclination = 0.39782 * Math.sin(toRadians(trueLongitude));
  const cosDeclination = Math.cos(Math.asin(sinDeclination));
  const localHourCosine =
    (Math.cos(toRadians(SOLAR_ZENITH))
      - sinDeclination * Math.sin(toRadians(OWNER_LATITUDE)))
    / (cosDeclination * Math.cos(toRadians(OWNER_LATITUDE)));

  const localHour = sunrise
    ? 360 - toDegrees(Math.acos(localHourCosine))
    : toDegrees(Math.acos(localHourCosine));
  const localMeanTime =
    localHour / 15 + rightAscension - 0.06571 * approximateTime - 6.622;
  const utcHours = normalizeHours(localMeanTime - longitudeHour);

  return new Date(Date.UTC(year, month - 1, day) + utcHours * 3_600_000);
}

function getOwnerTime() {
  const now = new Date();
  const dateParts = new Intl.DateTimeFormat('en-GB', {
    timeZone: OWNER_TIME_ZONE,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(now);
  const readPart = (type: Intl.DateTimeFormatPartTypes) =>
    Number(dateParts.find((part) => part.type === type)?.value ?? 0);
  const year = readPart('year');
  const month = readPart('month');
  const day = readPart('day');
  const sunrise = getSolarEventUtc(year, month, day, true);
  const sunset = getSolarEventUtc(year, month, day, false);

  return {
    date: now,
    period: now >= sunrise && now < sunset
      ? 'day' as const
      : 'night' as const,
  };
}

export function TimeOfDayIcon() {
  const [ownerTime, setOwnerTime] = useState(getOwnerTime);

  useEffect(() => {
    const refresh = () => setOwnerTime(getOwnerTime());
    const interval = window.setInterval(refresh, 60_000);

    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  const isDay = ownerTime.period === 'day';
  const label = `${isDay ? 'Daytime' : 'Nighttime'} in New Delhi`;
  const Icon = isDay ? Sun : Moon;

  return (
    <span
      className="kb-time-zone"
      role="img"
      aria-label={label}
      title={label}
      data-period={ownerTime.period satisfies TimePeriod}
    >
      <Icon key={ownerTime.period} aria-hidden="true" size={15} strokeWidth={1.7} />
      <span>IST (UTC+5:30)</span>
    </span>
  );
}
