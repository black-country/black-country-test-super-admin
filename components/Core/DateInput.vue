<script>
  import DatePicker from 'vue-datepicker-next';
  import 'vue-datepicker-next/index.css';

  export default {
    components: { DatePicker },
    data() {
      return {
        time3: null,
      };
    },
    watch: {
      time3(newValue) {
        if (newValue && newValue.length === 2) {
          const [startDate, endDate] = newValue.map(date =>
            this.formatDate(date)
          );
          this.$emit('date-selected', { startDate, endDate });
        }
      },
    },
    methods: {
      formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      },
    },
  };
</script>

<template>
  <div>
    <date-picker
      placeholder="Select date"
      v-model:value="time3"
      range
    ></date-picker>
  </div>
</template>


<style>
.date-picker {
  background-color: blue;
}

.mx-icon-left:before,
.mx-icon-right:before,
.mx-icon-double-left:before,
.mx-icon-double-right:before,
.mx-icon-double-left:after,
.mx-icon-double-right:after {
    content: '';
    position: relative;
    top: -1px;
    display: inline-block;
    width: 10px;
    height: 10px;
    vertical-align: middle;
    border-style: solid;
    border-color: currentColor;
    border-width: 2px 0 0 2px;
    border-radius: 1px;
    box-sizing: border-box;
    transform-origin: center;
}

.mx-icon-double-left:after {
    left: -4px;
}

.mx-icon-double-right:before {
    left: 4px;
}

.mx-icon-right:before,
.mx-icon-double-right:before,
.mx-icon-double-right:after {
    transform: rotate(135deg) scale(0.7);
}

.mx-btn {
    box-sizing: border-box;
    line-height: 1;
    font-size: 14px;
    font-weight: 500;
    padding: 7px 15px;
    margin: 0;
    cursor: pointer;
    background-color: transparent;
    outline: none;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    color: #73879c;
    white-space: nowrap;
}

.mx-btn-text {
    border: 0;
    padding: 0 4px;
    text-align: left;
    line-height: inherit;
}

.mx-scrollbar {
    height: 100%;
}

.mx-scrollbar:hover .mx-scrollbar-track {
    opacity: 1;
}

.mx-scrollbar-wrap {
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
}

.mx-scrollbar-track {
    position: absolute;
    top: 2px;
    right: 2px;
    bottom: 2px;
    width: 6px;
    z-index: 1;
    border-radius: 4px;
    opacity: 0;
    transition: opacity 0.24s ease-out;
}

.mx-scrollbar-track .mx-scrollbar-thumb {
    position: absolute;
    width: 100%;
    height: 0;
    cursor: pointer;
    border-radius: inherit;
    background-color: rgba(144, 147, 153, 0.3);
    transition: background-color 0.3s;
}

.mx-zoom-in-down-enter-active,
.mx-zoom-in-down-leave-active {
    opacity: 1;
    transform: scaleY(1);
    transition:
        transform 0.3s cubic-bezier(0.23, 1, 0.32, 1),
        opacity 0.3s cubic-bezier(0.23, 1, 0.32, 1);
    transform-origin: center top;
}

.mx-zoom-in-down-enter,
.mx-zoom-in-down-enter-from,
.mx-zoom-in-down-leave-to {
    opacity: 0;
    transform: scaleY(0);
}

.mx-datepicker {
    position: relative;
    display: inline-block;
    width: 100%;
}

.mx-datepicker svg {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}

.mx-datepicker-inline {
    width: auto;
}

.mx-input-wrapper {
    position: relative;
}

.mx-input-wrapper .mx-icon-clear {
    display: none;
}

.mx-input-wrapper:hover .mx-icon-clear {
    display: block;
}

.mx-input-wrapper:hover .mx-icon-clear + .mx-icon-calendar {
    display: none;
}

/* .mx-input {
    @apply w-full !bg-gray-100 px-4 py-2.5 outline-none text-black rounded-lg relative !text-start border !border-gray-100;
} */

.mx-input:hover,
.mx-input:focus {
    border-color: rgb(156 163 175 / var(--tw-border-opacity));
}

.mx-input:disabled,
.mx-input.disabled {
    color: #ccc;
    background-color: #f3f3f3;
    border-color: #ccc;
    cursor: not-allowed;
}

.mx-input:focus {
    outline: none;
}

.mx-input::-ms-clear {
    display: none;
}

.mx-icon-calendar,
.mx-icon-clear {
    position: absolute;
    top: 50%;
    right: 8px;
    transform: translateY(-50%);
    font-size: 16px;
    line-height: 1;
    color: rgba(0, 0, 0, 0.5);
    vertical-align: middle;
}

.mx-icon-clear {
    cursor: pointer;
}

.mx-icon-clear:hover {
    color: rgba(0, 0, 0, 0.8);
}

.mx-datepicker-main {
    font:
        14px/1.5 'Helvetica Neue',
        Helvetica,
        Arial,
        'Microsoft Yahei',
        sans-serif;
    color: #73879c;
    background-color: #fff;
    border: 1px solid #e8e8e8;
}

.mx-datepicker-popup {
	position: absolute;
    margin-top: 1px;
    margin-bottom: 1px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    z-index: 2001;
    top: auto;
    bottom: 0;
    background-color: #ffffff; /* Ensure background is solid */
}

/* .mx-datepicker-popup {
    position: absolute;
    margin-top: 1px;
    margin-bottom: 1px;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    z-index: 2001;
} */

.mx-datepicker-sidebar {
    float: left;
    box-sizing: border-box;
    width: 100px;
    padding: 6px;
    overflow: auto;
}

.mx-datepicker-sidebar + .mx-datepicker-content {
    margin-left: 100px;
    border-left: 1px solid #e8e8e8;
	background-color: #ffffff;
}

.mx-datepicker-body {
    position: relative;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.mx-btn-shortcut {
    display: block;
    padding: 0 6px;
    line-height: 24px;
}

.mx-datepicker-header {
    padding: 6px 8px;
    border-bottom: 1px solid #e8e8e8;
}

.mx-datepicker-footer {
    padding: 6px 8px;
    text-align: right;
    border-top: 1px solid #e8e8e8;
}

.mx-calendar-range,
.mx-time-range {
    display: flex;
}

@media (max-width: 750px) {
    .mx-calendar-range,
    .mx-time-range {
        flex-direction: column;
    }
}

.mx-calendar {
    background-color: #ffffff; /* Solid background for calendar */
    border: 1px solid #D3D3D3; /* Same thicker border for the calendar */
    border-radius: 8px; /* Match the popup style */
    padding: 10px; /* Add some spacing around the content */
}

.mx-calendar + .mx-calendar {
    border-left: 1px solid #e8e8e8;
}

.mx-calendar-header,
.mx-time-header {
    box-sizing: border-box;
    height: 34px;
    line-height: 34px;
    text-align: center;
    overflow: hidden;
}

.mx-btn-icon-left,
.mx-btn-icon-double-left {
    float: left;
}

.mx-btn-icon-right,
.mx-btn-icon-double-right {
    float: right;
}

.mx-calendar-header-label {
    font-size: 14px;
}

.mx-calendar-decade-separator {
    margin: 0 2px;
}

.mx-calendar-decade-separator:after {
    content: '~';
}

.mx-calendar-content {
    position: relative;
    height: 224px;
    box-sizing: border-box;
}

.mx-calendar-content .cell {
    cursor: pointer;
}

.mx-calendar-content .cell:hover {
    color: #73879c;
    background-color: #f3f9fe;
}


/* .mx-calendar-content .cell.active {
    color: #fff;
    background-color: #109352;
    border: none;
    @apply rounded-full shadow;
} */

.mx-calendar-content .cell.in-range,
.mx-calendar-content .cell.hover-in-range {
    color: #73879c;
    background-color: #dbedfb;
}

.mx-calendar-content .cell.disabled {
    cursor: not-allowed;
    color: #ccc;
    background-color: #f3f3f3;
}

.mx-calendar-week-mode .mx-date-row {
    cursor: pointer;
}

.mx-calendar-week-mode .mx-date-row:hover {
    background-color: #f3f9fe;
}

.mx-calendar-week-mode .mx-date-row.mx-active-week {
    background-color: #dbedfb;
}

.mx-calendar-week-mode .mx-date-row .cell:hover {
    color: inherit;
    background-color: transparent;
}

.mx-calendar-week-mode .mx-date-row .cell.active {
    color: inherit;
    background-color: transparent;
}

.mx-week-number {
    opacity: 0.5;
}

.mx-table {
    table-layout: fixed;
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    text-align: center;
}

.mx-table th {
    padding: 0;
    font-weight: 500;
    vertical-align: middle;
}

.mx-table td {
    padding: 0;
    vertical-align: middle;
}

.mx-table-date td,
.mx-table-date th {
    height: 32px;
    font-size: 12px;
}

.mx-table-date .today {
    color: #2a90e9;
}

.mx-table-date .cell.not-current-month {
    color: #ccc;
    background: none;
}

.mx-time {
    flex: 1;
    width: 224px;
    background: #fff;
}

.mx-time + .mx-time {
    border-left: 1px solid #e8e8e8;
}

.mx-date-time {
    position: relative;
    width: 248px;
    height: 270px;
}

.mx-date-time .mx-time {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.mx-date-time-range {
    position: relative;
    width: 496px;
    height: 270px;
}

.mx-date-time-range .mx-time-range {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.mx-time-header {
    border-bottom: 1px solid #e8e8e8;
}

.mx-time-content {
    height: 224px;
    box-sizing: border-box;
    overflow: hidden;
}

.mx-time-columns {
    display: flex;
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.mx-time-column {
    flex: 1;
    position: relative;
    border-left: 1px solid #e8e8e8;
    text-align: center;
}

.mx-time-column:first-child {
    border-left: 0;
}

.mx-time-column .mx-time-list {
    margin: 0;
    padding: 0;
    list-style: none;
}

.mx-time-column .mx-time-list::after {
    content: '';
    display: block;
    height: 192px;
}

.mx-time-column .mx-time-item {
    cursor: pointer;
    font-size: 12px;
    height: 32px;
    line-height: 32px;
}

.mx-time-column .mx-time-item:hover {
    color: #73879c;
    background-color: #f3f9fe;
}

.mx-time-column .mx-time-item.active {
    color: #1284e7;
    background-color: transparent;
    font-weight: 700;
}

.mx-time-column .mx-time-item.disabled {
    cursor: not-allowed;
    color: #ccc;
    background-color: #f3f3f3;
}

.mx-time-option {
    cursor: pointer;
    padding: 8px 10px;
    font-size: 14px;
    line-height: 20px;
}

.mx-time-option:hover {
    color: #73879c;
    background-color: #f3f9fe;
}

.mx-time-option.active {
    color: #1284e7;
    background-color: transparent;
    font-weight: 700;
}

.mx-time-option.disabled {
    cursor: not-allowed;
    color: #ccc;
    background-color: #f3f3f3;
}
</style>